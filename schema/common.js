'use strict'

const S = require('fluent-json-schema')
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.addSchema(
    S.object()
      .id('errorSchema')
      .title('Error Schema')
      .description('Schema for error response')
      .prop('message', S.string())
  )
})
