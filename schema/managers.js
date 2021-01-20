'use strict'

const S = require('fluent-json-schema')
const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
  fastify.addSchema(
    S.object()
      .id('managerSchema')
      .title('Schema for manager')
      .prop('name', S.string().required())
      .prop('description', S.string().required())
      .prop('website', S.string().required())
      .prop('email', S.string().format(S.FORMATS.EMAIL).required())
      .prop('logo', S.string().required())
  )

  fastify.addSchema(
    S.object()
      .id('managerSchemaResponse')
      .title('Schema for manager response')
      .prop('_id', S.string())
      .prop('name', S.string())
      .prop('description', S.string())
      .prop('website', S.string())
      .prop('email', S.string())
      .prop('logo', S.string())
  )

  fastify.addSchema(
    S.object()
      .id('managerSchemaMultipart')
      .prop('value', S.string().required())
  )
})
