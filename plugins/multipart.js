'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
  // register fastify-multipart plugin
  const options = {
    attachFieldsToBody: true,
    limits: {
      fileSize: 1000000
    }
  }

  fastify.register(require('fastify-multipart'), options)
})
