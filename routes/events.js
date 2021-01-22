'use strict'

const S = require('fluent-json-schema')
const DUPLICATE_KEY_ERROR = 11000
const fs = require('fs')

module.exports = async (fastify, opts) => {
  const events = fastify.mongo.training.db.collection('events')
  events.createIndex({
    name: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  // register fastify-multipart plugin
  const options = {
    attachFieldsToBody: true
  }

  fastify.register(require('fastify-multipart'), options)

  // routes
  fastify.post('/', {
    schema: {
      body: S.ref('eventSchemaMultipart'),

      response: {
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req

    try {
      const dir = './images'

      let categories
      if (Array.isArray(body.categories)) {
        categories = []
        body.categories.forEach(category => {
          console.log(category.value)
          categories.push(ObjectId(category.value))
        })
      } else {
        categories = ObjectId(body.categories.value)
      }

      let tags
      if (Array.isArray(body.tags)) {
        tags = []
        body.tags.forEach(tag => {
          tags.push(tag.value)
        })
      } else {
        tags = body.tags.value
      }

      await events.insertOne({
        name: body.name.value,
        description: body.name.value,
        categories: categories,
        manager: ObjectId(body.manager.value),
        state: body.state.value,
        maxInvited: body.maxInvited.value,
        dateTime: new Date(body.dateTime.value),
        duration: body.duration.value,
        type: body.type.value,
        tags: tags,
        address: body.address.value,
        link: body.link.value,
        isPublic: body.isPublic.value
      }).then(async (result) => {
        const imagesList = []

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir)
        }

        if (!fs.existsSync(`${dir}/event_${result.insertedId}`)) {
          fs.mkdirSync(`${dir}/event_${result.insertedId}`)
        }

        if (Array.isArray(body.images)) {
          body.images.forEach(async (image) => {
            if (image.mimetype.match(/.(jpg|jpeg|png)$/i)) {
              const dataFile = await image.toBuffer()

              const file = `${dir}/event_${result.insertedId}/${image.filename}`
              console.log(file)

              const stream = fs.createWriteStream(`${file}`)

              stream.write(dataFile)

              imagesList.push(stream.path)
            }
          })

          await events.updateOne({ _id: ObjectId(result.insertedId) }, {
            $set: { images: imagesList }
          })
        } else {
          const dataFile = await body.images.toBuffer()

          const file = `${dir}/event_${result.insertedId}/${body.images.filename}`

          const stream = fs.createWriteStream(`${file}`)

          stream.write(dataFile)

          await events.updateOne({ _id: ObjectId(result.insertedId) }, {
            $set: { images: stream.path }
          })
        }

        return res.code(200).send({ message: 'Successfully created event' })
      })
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/all', {
    schema: {
      response: {
        200: S.array().items(S.ref('eventSchemaResponse')),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    try {
      const eventsList = await events.find({}).sort({
        dateTime: -1
      }).toArray()

      return eventsList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/:id', {
    schema: {
      params: S.object()
        .prop('id', S.string().required()),
      response: {
        200: S.ref('eventSchemaResponse'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      const event = await events.findOne({ _id: ObjectId(id) })
      return event
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.delete('/:id', {
    schema: {
      params: S.object().prop('id', S.string().required()),
      response: {
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      await events.deleteOne({ _id: ObjectId(id) })

      return res.code(204).send()
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.put('/:id', {
    schema: {
      body: S.ref('eventSchema'),
      params: S.object().prop('id', S.string().required()),
      response: {
        // 200: S.ref('eventSchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req
    const { id } = req.params

    try {
      const updatedEvent = await events.findOneAndUpdate({ _id: ObjectId(id) },
        { $set: body },
        { returnOriginal: false }
      )

      return updatedEvent
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: `Event with name ${body.name} already exist` })
      }
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/events'
