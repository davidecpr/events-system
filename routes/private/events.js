'use strict'

const { default: s } = require('fluent-json-schema')
const S = require('fluent-json-schema')
const DUPLICATE_KEY_ERROR = 11000
const fs = require('fs')
const mime = require('mime')
const imgsDir = '../../public/events'
const path = require('path')

module.exports = async (fastify, opts) => {
  const eventsCollection = fastify.mongo.training.db.collection('events')
  const managersCollection = fastify.mongo.training.db.collection('managers')
  const categoriesCollection = fastify.mongo.training.db.collection('categories')
  eventsCollection.createIndex({
    name: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.post('/', {
    schema: {
      security: [
        {
          JWT: []
        }
      ],
      tags: ['Eventi'],
      body: S.ref('eventShema'),
      response: {
        200: S.ref('eventSchemaResponse'),
        400: S.ref('errorSchema'),
        404: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req

    try {
      // check if manager and category exists
      const manager = await managersCollection.findOne({ _id: ObjectId(body.manager) })
      if (manager) {
        const category = await categoriesCollection.findOne({ _id: ObjectId(body.category) })
        if (!category) { return res.code(404).send({ message: 'Category not found' }) }
      } else {
        return res.code(404).send({ message: 'Manager not found' })
      }

      const dateEvent = new Date(body.dateTime)
      const startEvent = new Date(body.startDateTime)
      const endEvent = new Date(body.endDateTime)

      if (endEvent <= startEvent) { return res.code(500).send({ message: 'The start date cannot be less than or equal to the end date' }) }

      Object.assign(body, {
        dateTime: dateEvent,
        startDateTime: startEvent,
        endDateTime: endEvent
      })

      const newEvent = await eventsCollection.insertOne(body)

      Object.assign(body, {
        _id: newEvent.insertedId
      })

      return body
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: 'Events with this name already exists' })
      }
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.put('/:id', {
    schema: {
      security: [
        {
          JWT: []
        }
      ],
      tags: ['Eventi'],
      body: S.ref('eventShema'),
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })).required(),
      response: {
        200: S.ref('eventSchemaResponse'),
        404: S.ref('errorSchema'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req
    const { id } = req.params

    try {
      const event = await eventsCollection.findOne({ _id: ObjectId(id) })
      if (!event) { return res.code(404).send({ message: 'Event not found' }) }

      const category = await categoriesCollection.findOne({ _id: ObjectId(body.category) })
      if (!category) { return res.code(404).send({ message: 'Category not found' }) }

      const manager = await managersCollection.findOne({ _id: ObjectId(body.manager) })
      if (!manager) { return res.code(404).send({ message: 'Manager not found' }) }

      await eventsCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: body }
      )

      return await eventsCollection.findOne({ _id: ObjectId(id) })
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.post('/set/photos/:id', {
    schema: {
      security: [
        {
          JWT: []
        }
      ],
      tags: ['Eventi'],
      body: S.ref('eventSchemaMultipart'),
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })),
      response: {
        200: S.oneOf([S.object().prop('url', S.string()), S.array().items(S.object().prop('url', S.string()))]),
        404: S.ref('errorSchema'),
        400: S.ref('errorSchema'),
        500: s.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params
    const { body } = req

    try {
      // check if event exists
      const event = await eventsCollection.findOne({ _id: ObjectId(id) })
      if (!event) { return res.code(404).send({ message: 'Event not found' }) }

      // check if directory exist
      checkDirectory(id)

      // check if photos is an array
      if (Array.isArray(body.photos)) {
        // check if all images ext are ok
        for (const photo of body.photos) {
          if (!photo.mimetype.match(/.(jpg|jpeg|png)$/i)) { return res.code(500).send({ message: `File ${photo.filename} is not an image` }) }
        }
        const eventPhotos = []
        const returnUrls = []

        // save images
        for (const photo of body.photos) {
          const file = await photo.toBuffer()
          const fileName = `${Date.now()}.${mime.getExtension(photo.mimetype)}`
          const managerImage = path.join(path.join(__dirname, imgsDir, `event_${id}`), fileName)
          const stream = fs.createWriteStream(managerImage)

          stream.write(file)
          eventPhotos.push(fileName)
          returnUrls.push({ url: path.join(__dirname, imgsDir, fileName) })
        }

        await eventsCollection.updateOne({ _id: ObjectId(id) }, {
          $push: { photos: { $each: eventPhotos } }
        })

        return returnUrls
      } else {
        // get single photo
        const photo = body.photos

        const file = await photo.toBuffer()
        const fileName = `${Date.now()}.${mime.getExtension(photo.mimetype)}`
        const managerImage = path.join(path.join(__dirname, imgsDir, `event_${id}`), fileName)
        const stream = fs.createWriteStream(managerImage)

        stream.write(file)

        await eventsCollection.updateOne({ _id: ObjectId(id) }, {
          $push: { photos: { $each: [fileName] } }
        })

        return { url: path.join(__dirname, imgsDir, fileName) }
      }
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.delete('/:id', {
    schema: {
      security: [
        {
          JWT: []
        }
      ],
      tags: ['Eventi'],
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })),
      response: {
        404: S.ref('errorSchema'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      const event = await eventsCollection.findOne({ _id: ObjectId(id) })
      if (!event) { return res.code(404).send({ message: 'Event not found' }) }

      // delete image
      if (event.photos !== undefined) {
        if (fs.existsSync(path.join(__dirname, imgsDir, `event_${id}`))) { fs.rmdirSync(path.join(__dirname, imgsDir, `event_${id}`), { recursive: true }) }
      }

      await eventsCollection.deleteOne({ _id: ObjectId(id) })

      return res.code(201).send()
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  function checkDirectory (id) {
    if (!fs.existsSync(path.join(__dirname, imgsDir, `event_${id}`))) {
      fs.mkdirSync(path.join(__dirname, imgsDir, `event_${id}`), { recursive: true })
    }
  }
}

module.exports.autoPrefix = '/events'
