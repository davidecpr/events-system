'use strict'

const S = require('fluent-json-schema')
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.addSchema(
    S.object()
      .id('categorySchema')
      .title('Category Schema')
      .prop('name', S.string().required())
      .prop('slug', S.string().required())
      .prop('description', S.string().required())
      .prop('icon', S.string().required())
  )

  fastify.addSchema(
    S.object()
      .id('categorySchemaResponse')
      .title('Category Schema Response')
      .prop('_id', S.string())
      .prop('name', S.string())
      .prop('slug', S.string())
      .prop('description', S.string())
      .prop('icon', S.string())
  )
})
