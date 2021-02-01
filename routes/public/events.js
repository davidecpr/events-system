'use strict'

const S = require('fluent-json-schema')

module.exports = async (fastify, opts) => {
  const eventsCollection = fastify.mongo.training.db.collection('events')
  eventsCollection.createIndex({
    name: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.get('/:id', {
    schema: {
      tags: ['Eventi'],
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })),
      response: {
        200: S.ref('eventSchemaResponse'),
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

      return event
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/photo/:eventId/:photo', {
    schema: {
      tags: ['Eventi'],
      params: S.object()
        .prop('eventId', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' }).required())
        .prop('photo', S.raw({ type: 'string', pattern: '(jpg|png|jpeg)' }).minLength(5).required()),
      response: {
        404: S.ref('errorSchema'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { eventId } = req.params
    const { photo } = req.params

    try {
      const event = await eventsCollection.findOne({ _id: ObjectId(eventId) })
      if (!event) {
        return res.code(404).send({ message: 'Event not found' })
      }
      return res.sendFile(`events/event_${eventId}/${photo}`)
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.post('/all', {
    schema: {
      tags: ['Eventi'],
      body: S.object()
        .prop('category', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' }))
        .prop('manager', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' }))
        .prop('date', S.string().format(S.FORMATS.DATE)),
      response: {
        200: S.array().items(S.ref('eventSchemaResponse')),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { category } = req.body
    const { manager } = req.body
    const { date } = req.body

    try {
      const obj = {}

      if (category !== undefined && category !== '') {
        Object.assign(obj, {
          category: category
        })
      }

      if (manager !== undefined && manager !== '') {
        Object.assign(obj, {
          manager: manager
        })
      }

      if (date !== undefined && date !== '') {
        const queryDate = new Date(date)
        Object.assign(obj, {
          dateTime: { $gt: new Date(date), $lt: new Date(queryDate.setDate(queryDate.getDate() + 1)) }
        })
      } else {
        Object.assign(obj, {
          $expr: { $gt: ['$endDateTime', new Date()] }
        })
      }

      const eventsList = await eventsCollection.find(obj).sort({
        dateTime: -1
      }).toArray()

      return eventsList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/events'
