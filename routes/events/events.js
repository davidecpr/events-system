'use strict'

const S = require('fluent-json-schema')

module.exports = async (fastify, opts) => {
  const events = fastify.mongo.training.db.collection('events')
  const { ObjectId } = fastify.mongo

  fastify.post('/', {
    schema: {
      body: S.ref('#eventSchema'),
      response: {
        200: S.ref('#eventSchemaResponse'),
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
        });

      await events.insertOne({ name: body.name, description: body.description, images: body.images, categories: categoriesList})
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }

    return body

  })

  fastify.get('/:id', {
    schema: {
        params: S.object()
            .prop('id', S.string().required()),
        response: {
            200: S.ref('#eventSchemaResponse'),
            500: S.ref('errorSchema')
        }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
        const event = await events.findOne({_id: ObjectId(id) })
        return event
    } catch (e) {
        return res.code(500).send({message: e.message})
    }
  })

}

module.exports.autoPrefix = '/events'
