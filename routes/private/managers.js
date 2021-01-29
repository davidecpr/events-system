'use strict'

const S = require('fluent-json-schema')
const DUPLICATE_KEY_ERROR = 11000
const fs = require('fs')
const mime = require('mime')
const imgsDir = '../../public/managers'
const path = require('path')

module.exports = async (fastify, opts) => {
  const managersCollection = fastify.mongo.training.db.collection('managers')
  managersCollection.createIndex({
    email: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.post('/', {
    schema: {
      security: [
        {
          JWT: []
        }
      ],
      tags: ['Organizzatori'],
      body: S.ref('managerSchema'),
      response: {
        200: S.ref('managerSchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req

    try {
      const newManager = await managersCollection.insertOne(body)

      Object.assign(body, {
        _id: newManager.insertedId
      })

      return body
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: `Manager with email ${body.email} already exsist` })
      }
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.put('/:id', {
    schema: {
      security: [
        {
          JWT: []
        }
      ],
      tags: ['Organizzatori'],
      body: S.ref('managerSchema'),
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })).required(),
      response: {
        200: S.ref('managerSchemaResponse'),
        400: S.ref('errorSchema'),
        404: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params
    const { body } = req

    try {
      const manager = await managersCollection.findOne({ _id: ObjectId(id) })
      if (!manager) { return res.code(404).send({ message: 'Manager not found' }) }

      await managersCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: body }
      )

      return await managersCollection.findOne({ _id: ObjectId(id) })
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.delete('/:id', {
    schema: {
      security: [
        {
          JWT: []
        }
      ],
      tags: ['Organizzatori'],
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })).required(),
      response: {
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

      // delete image
      if (manager.logo !== undefined) {
        if (fs.existsSync(path.join(__dirname, imgsDir, manager.logo))) { fs.unlinkSync(path.join(__dirname, imgsDir, manager.logo)) }
      }

      await managersCollection.deleteOne({ _id: ObjectId(id) })

      return res.code(201).send()
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.post('/set/logo/:id', {
    schema: {
      security: [
        {
          JWT: []
        }
      ],
      tags: ['Organizzatori'],
      body: S.object().prop('logo', S.object().required()),
      params: S.object().prop('id', S.raw({ type: 'string', pattern: '^[0-9a-fA-F]{24}$' })).required(),
      response: {
        200: S.object().prop('url', S.string()),
        400: S.ref('errorSchema'),
        404: S.ref('errorSchema'),
        500: S.string('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req
    const { id } = req.params

    try {
      const manager = await managersCollection.findOne({ _id: ObjectId(id) })
      if (!manager) { return res.code(404).send({ message: 'Manager not found' }) }

      checkDirectory()

      if (!body.logo.mimetype.match(/.(jpg|jpeg|png)$/i)) { return res.code(500).send({ message: `File ${body.logo.filename} is not an image` }) }

      const file = await body.logo.toBuffer()
      const fileName = `manager_${id}.${mime.getExtension(body.logo.mimetype)}`
      const managerImage = path.join(path.join(__dirname, imgsDir), fileName)
      const stream = fs.createWriteStream(managerImage)

      stream.write(file)

      await managersCollection.updateOne({ _id: ObjectId(id) }, {
        $set: { logo: fileName }
      })

      return { url: path.join(__dirname, imgsDir, fileName) }
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  function checkDirectory () {
    if (!fs.existsSync(path.join(__dirname, imgsDir))) {
      fs.mkdirSync(path.join(__dirname, imgsDir), { recursive: true })
    }
  }
}

module.exports.autoPrefix = '/managers'
