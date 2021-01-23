'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
  // register fastify-multipart plugin
  const options = {
    attachFieldsToBody: true
  }

  fastify.register(require('fastify-multipart'), options)
})
