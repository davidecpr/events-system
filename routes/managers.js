'use strict'

const S = require('fluent-json-schema')
const DUPLICATE_KEY_ERROR = 11000

module.exports = async (fastify, opts) => {
  const managers = fastify.mongo.training.db.collection('managers')
  // managers.dropIndexes()
  managers.createIndex({
    email: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.post('/', {
    schema: {
      body: S.ref('#managerSchema'),
      response: {
        200: S.ref('#managerSchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req

    try {
      await managers.insertOne(body)
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: `Manager with email "${body.email}" already exists` })
      }
      return res.code(500).send({ message: e.message })
    }

    return body
  })

  fastify.get('/:id', {
    schema: {
      response: {
        200: S.ref('#managerSchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      const manager = await managers.findOne({ _id: ObjectId(id) })

      return manager
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/all', {
    schema: {
      response: {
        200: S.array().items(S.ref('#managerSchemaResponse')),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    try {
      const managersList = await managers
        .find({})
        .sort({
          name: -1
        })
        .toArray()

      return managersList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.delete('/:id', {
    schema: {
      params: S.object()
        .prop('id', S.string().required()),
      response: {
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      await managers.deleteOne(({ _id: ObjectId(id) }))

      return res.code(204).send()
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/search/:query', {
    schema: {
      params: S.object()
        .prop('query', S.string().required()),
      response: {
        200: S.array().items(S.ref('#managerSchemaResponse')),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { query } = req.params

    try {
      const managersList = await managers.find({ $or: [{ name: query }, { email: query }, { description: query }, { website: query }] }).toArray()

      return managersList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/managers'
