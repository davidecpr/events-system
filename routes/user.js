'use strict'

const S = require('fluent-json-schema')

module.exports = async (fastify, opts) => {
  const managers = fastify.mongo.training.db.collection('managers')
  const categories = fastify.mongo.training.db.collection('categories')
  const events = fastify.mongo.training.db.collection('events')
  const { ObjectId } = fastify.mongo

  fastify.get('/managers', {
    schema: {
      response: {
        200: S.array().items(S.ref('managerSchemaResponse')),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    try {
      const managersList = await managers.find({}).toArray()

      return managersList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/categories', {
    schema: {
      response: {
        200: S.array().items(S.ref('categorySchemaResponse')),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    try {
      const categoriesList = await categories.find({}).toArray()

      return categoriesList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/events/all', {
    schema: {
      response: {
        200: S.array().items(S.ref('eventSchemaResponse')),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    try {
      const eventsList = await events.find({}).sort({
        dateTime: 1
      }).toArray()

      return eventsList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/events/search/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          filter: { type: 'string' }
        },
        anyOf: [
          {
            required: ['query', 'filter']
          }
        ]
      }

    }
  }, async (req, res) => {
    try {
      // get filter

      const { filter } = req.query
      const { query } = req.query

      if (filter === 'category') {
        // filter by category

        let categoryId
        try {
          categoryId = ObjectId(query)
        } catch (e) {
          return res.code(500).send({ message: 'The category id is invalid' })
        }

        const eventsList = await events.find({
          categories: categoryId
        }).sort({
          dateTime: 1
        }).toArray()

        return eventsList
      } else if (filter === 'manager') {
        // filter by manager

        let managerId
        try {
          managerId = ObjectId(query)
        } catch (e) {
          return res.code(500).send({ message: 'The manager id is invalid' })
        }

        const eventsList = await events.find({
          manager: managerId
        }).sort({
          dateTime: 1
        }).toArray()

        return eventsList
      } else if (filter === 'date') {
        // filter by date
        console.log(new Date(query))
        const date = new Date(query)
        console.log(new Date(date.setDate(date.getDate() + 1)))

        const eventsList = await events.find({
          dateTime: { $gt: new Date(query), $lt: new Date(date.setDate(date.getDate() + 1)) }
        })
          .sort({
            dateTime: 1
          })
          .toArray()

        return eventsList
      }

      return res.code(500).send({ message: `Filter ${filter} not found` })
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/users'
