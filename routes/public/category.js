'use strict'

const S = require('fluent-json-schema')

module.exports = async (fastify, opts) => {
  const categoryCollection = fastify.mongo.training.db.collection('categories')
  categoryCollection.createIndex({
    name: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.post('/all', {
    schema: {
      tags: ['Categorie'],
      body: S.object()
        .prop('query', S.string()),
      response: {
        200: S.array().items(S.ref('categorySchemaResponse')),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {

    const {query} = req.body

    try {
      if (query !== undefined && query !== '') {
        return await categoryCollection.find({$or: [
          {name: new RegExp(query)},
          {slug: new RegExp(query)},
          {description: new RegExp(query)},
        ]}).toArray()
      } else {
        return await categoryCollection.find({}).toArray()
      }
      
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/:id', {
    schema: {
      tags: ['Categorie'],
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })).required(),
      response: {
        200: S.ref('categorySchemaResponse'),
        400: S.ref('errorSchema'),
        404: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      const category = await categoryCollection.findOne({ _id: ObjectId(id) })
      if (!category) { return res.code(404).send({ message: 'Category not found' }) }

      return category
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/category'
