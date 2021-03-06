'use strict'

const { default: s } = require('fluent-json-schema')
const S = require('fluent-json-schema')
const DUPLICATE_KEY_ERROR = 11000
const fs = require('fs')
const mime = require('mime')
const imgsDir = '../../static/events'
const path = require('path')
const handlebars = require('handlebars')
const { readFile } = require('fs').promises
const { resolve } = require('path')

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

  fastify.post('/sendInvitations/:id', {
    schema: {
      body: S.object().prop('users', S.array().items(S.string()).minItems(1).required()),
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })),
      response: {
        400: S.ref('errorSchema'),
        404: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params
    const { body } = req

    try {
      const { nodemailer } = fastify
      const recipient = body.email

      const event = await eventsCollection.findOne({ _id: ObjectId(id) })
      if (!event) { return res.code(404).send({ message: 'Event not found' }) }

      if (event.isPublic) { return res.code(400).send({ message: 'This event is public' }) }

      if (body.length > event.maxInvited) { return res.code(400).send({ message: `A maximum of ${event.maxInvited} people can participate in this event` }) }

      const category = await categoriesCollection.findOne({ _id: ObjectId(event.category) })
      const manager = await managersCollection.findOne({ _id: ObjectId(event.manager) })

      const html = fs.readFileSync(path.join(__dirname, '../../static/mail.html'), 'utf-8')

      const template = handlebars.compile(html)
      const replacements = {
        name: 'name',
        description: event.description,
        category: category.name,
        manager: manager.name,
        state: event.state,
        maxInvited: event.maxInvited,
        dateTime: event.dateTime,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        type: event.type,
        tags: event.tags,
        address: event.street + ' ' + event.streetName + ' ' + event.number + ' ' + event.zipcode,
        link: event.link,
        isPublic: event.isPublic ? 'Pubblico' : 'Riservato',
        details: 'http://' + process.env.FASTIFY_ADDRESS + ':' + process.env.FASTIFY_PORT + '/events/' + event._id
      }
      const htmlToSend = template(replacements)

      await nodemailer.sendMail({
        from: 'testevents21@gmail.com',
        to: recipient,
        subject: 'test',
        html: htmlToSend
      })

      return res.code(200).send()
      
    } catch (e) {
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
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: 'Event with this name already exists' })
      }
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.post('/photos/:id', {
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
          returnUrls.push({ url: fileName })
        }

        await eventsCollection.updateOne({ _id: ObjectId(id) }, {
          $push: { photos: { $each: eventPhotos } }
        })

        return returnUrls
      } else {
        // get single photo
        const photo = body.photos

        if (!photo.mimetype.match(/.(jpg|jpeg|png)$/i)) { return res.code(500).send({ message: `File ${photo.filename} is not an image` }) }

        const file = await photo.toBuffer()
        const fileName = `${Date.now()}.${mime.getExtension(photo.mimetype)}`
        const managerImage = path.join(path.join(__dirname, imgsDir, `event_${id}`), fileName)
        const stream = fs.createWriteStream(managerImage)

        stream.write(file)

        await eventsCollection.updateOne({ _id: ObjectId(id) }, {
          $push: { photos: { $each: [fileName] } }
        })

        return { url: fileName }
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
