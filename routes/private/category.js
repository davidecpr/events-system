'use strict'

const { default: s } = require('fluent-json-schema')
const S = require('fluent-json-schema')
const DUPLICATE_KEY_ERROR = 11000

module.exports = async (fastify, opts) => {
  const categoryCollection = fastify.mongo.training.db.collection('categories')
  categoryCollection.createIndex({
    name: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.post('/', {
    schema: {
      security: [
        {
          "JWT": []
        }
      ],
      tags: ['Categorie'],
      body: S.ref('categorySchema'),
      response: {
        200: S.ref('categorySchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req

    try {
      const newCategory = await categoryCollection.insertOne(body)

      Object.assign(body, {
        _id: newCategory.insertedId
      })

      return body
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: 'Category with this name already exist' })
      }
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.put('/:id', {
    schema: {
      security: [
        {
          "JWT": []
        }
      ],
      tags: ['Categorie'],
      body: S.ref('categorySchema'),
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })).required(),
      response: {
        200: S.ref('categorySchemaResponse'),
        400: S.ref('errorSchema'),
        404: S.ref('errorSchema'),
        500: s.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params
    const { body } = req

    try {

      const catregory = await categoryCollection.findOne({ _id: ObjectId(id) })
      if (!catregory) { return res.code(404).send({ message: 'Category not found' }) }

      await categoryCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: body }
      )

      Object.assign(body, {
        _id: id
      })

      return body
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.delete('/:id', {
    schema: {
      security: [
        {
          "JWT": []
        }
      ],
      tags: ['Categorie'],
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })).required(),
      response: {
        404: S.ref('errorSchema'),
        400: S.ref('errorSchema'),
        500: s.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {

      if (!await categoryCollection.findOne({ _id: ObjectId(id) })) { return res.code(404).send({ message: 'Category not found' }) }

      await categoryCollection.deleteOne({ _id: ObjectId(id) })

      return res.code(201).send()
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/category'
