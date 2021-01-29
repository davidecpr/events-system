'use strict'

const S = require('fluent-json-schema')
const path = require('path')

module.exports = async (fastify, opts) => {
  const managersCollection = fastify.mongo.training.db.collection('managers')
  managersCollection.createIndex({
    email: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.get('/:id', {
    schema: {
      tags: ['Organizzatori'],
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' }).required()),
      response: {
        200: S.ref('managerSchemaResponse'),
        400: S.ref('errorSchema'),
        404: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      const manager = await managersCollection.findOne({ _id: ObjectId(id) })
      if (!manager) { return res.code(404).send({ message: 'Manager not found' }) }

      return manager
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/all', {
    schema: {
      tags: ['Organizzatori'],
      response: {
        200: S.array().items(S.ref('managerSchemaResponse')),
        400: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    try {
      return await managersCollection.find({}).toArray()
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/get/logo/:id', {
    schema: {
      tags: ['Organizzatori'],
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' }).required()),
      response: {
        404: S.ref('errorSchema'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      const manager = await managersCollection.findOne({ _id: ObjectId(id) })
      if (!manager) { return res.code(404).send({ message: 'Manager not found' }) }

      return res.sendFile(`managers/manager_${id}${path.extname(manager.logo)}`)
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/managers'
