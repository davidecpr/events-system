'use strict'

const S = require('fluent-json-schema')
const DUPLICATE_KEY_ERROR = 11000

module.exports = async (fastify, opts) => {
  const categories = fastify.mongo.training.db.collection('categories')
  categories.createIndex({
    name: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.post('/', {
    schema: {
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
      await categories.insertOne(body)
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
        200: S.array().items(S.ref('categorySchemaResponse')),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    try {
      const categoriesList = categories
        .find({})
        .sort({
          name: 1
        })
        .toArray()

      return categoriesList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/:id', {
    schema: {
      params: S.object()
        .prop('id', S.string().required()),
      reponse: {
        200: S.ref('categorySchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      const category = await categories.findOne({ _id: ObjectId(id) })

      return category
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
      await categories
        .deleteOne({ _id: ObjectId(id) })

      return res.code(204).send()
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/search/:query', async (req, res) => {
    const { query } = req.params
    console.log(query)

    try {
      const categoriesList = await categories.find({ $or: [{ name: query }, { slug: query }, { description: query }] }).toArray()

      return categoriesList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.put('/:id', {
    schema: {
      body: S.ref('categorySchema'),
      params: S.object().prop('id', S.string().required()),
      response: {
        // 200: S.ref('categorySchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req
    const { id } = req.params

    try {
      const updatedCategory = await categories.findOneAndUpdate({ _id: ObjectId(id) }, { $set: body }, { returnOriginal: false })

      return updatedCategory
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: `Category with name ${body.name} already exist` })
      }
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/categories'
