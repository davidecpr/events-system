'use strict'

const S = require('fluent-json-schema')
const DUPLICATE_KEY_ERROR = 11000
const fs = require('fs')
const mime = require('mime')
const imagesDir = '../images'
const path = require('path')
const { dirname } = require('path')

module.exports = async (fastify, opts) => {
  const managers = fastify.mongo.training.db.collection('managers')
  managers.createIndex({
    email: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.post('/', {
    schema: {
      body: S.ref('managerSchemaMultipart'),
      response: {
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req

    try {
      const dataFile = await body.logo.toBuffer()
      const imgDir = path.join(__dirname, imagesDir)

      if (!fs.existsSync(imgDir)) {
        fs.mkdirSync(imgDir)
      }

      await managers.insertOne({
        name: body.name.value,
        description: body.description.value,
        website: body.website.value,
        email: body.email.value
      }).then(async (result) => {

        const managerImage = path.join(imgDir, `manager_${Date.now()}.${mime.getExtension(body.logo.mimetype)}`)

        const stream = fs.createWriteStream(managerImage)

        stream.write(dataFile)

        await managers.updateOne({ _id: ObjectId(result.insertedId) }, {
          $set: { logo: stream.path }
        })
      })

      return res.code(200).send({ message: 'Successfully created manager' })
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(200).send({ message: `Manager with email ${body.email.value} already exsist` })
      }
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.get('/:id', {
    schema: {
      response: {
        200: S.ref('managerSchemaResponse'),
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
        200: S.array().items(S.ref('managerSchemaResponse')),
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
        200: S.array().items(S.ref('managerSchemaResponse')),
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

  fastify.put('/:id', {
    schema: {
      body: S.ref('managerSchema'),
      response: {
        // 200: S.ref('managerSchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req
    const { id } = req.params

    try {
      const updatedManager = await managers.findOneAndUpdate({ _id: ObjectId(id) }, { $set: body }, { returnOriginal: false })

      return updatedManager
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: `Manager with email ${body.email} already exist` })
      }
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/managers'
