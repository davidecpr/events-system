'use strict'

const S = require('fluent-json-schema')
const DUPLICATE_KEY_ERROR = 11000

module.exports = async (fastify, opts) => {
  const events = fastify.mongo.training.db.collection('events')
  events.createIndex({
    name: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.post('/', {
    schema: {
      body: S.ref('eventSchema'),
      response: {
        200: S.ref('eventSchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req

    try {
      const categoriesList = []
      body.categories.forEach(category => {
        categoriesList.push(ObjectId(category))
      })

      await events.insertOne({
        name: body.name,
        description: body.description,
        images: body.images,
        categories: categoriesList,
        manager: ObjectId(body.manager),
        state: body.state,
        maxInvited: body.maxInvited,
        dateTime: body.dateTime,
        duration: body.duration,
        type: body.type,
        tags: body.tags,
        address: body.address,
        link: body.link,
        isPublic: body.isPublic
      })
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: `Event with name "${body.name}" already exists` })
      }
      return res.code(500).send({ message: e.message })
    }

    return body
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
        200: S.ref('eventSchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req
    const { id } = req.params

    const update = {
      name: body.name,
      description: body.description,
      images: body.images,
      categories: body.categories,
      manager: body.manager,
      state: body.state,
      maxInvited: body.maxInvited,
      dateTime: body.dateTime,
      duration: body.duration,
      type: body.type,
      tags: body.tags,
      address: body.address,
      link: body.link,
      isPublic: body.isPublic
    }

    try {
      await events.updateOne({ _id: ObjectId(id) },
        { $set: update },
        { upsert: false }
      )

      return body
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: `Event with name ${body.name} already exist` })
      }
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/events'
