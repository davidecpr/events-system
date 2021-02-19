'use strict'

const S = require('fluent-json-schema')
const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
  fastify.addSchema(
    S.object()
      .id('managerSchema')
      .title('Manager schema')
      .description('Schema for manager validation')
      .prop('name', S.string().minLength(5).maxLength(20).required())
      .prop('description', S.string().minLength(5).maxLength(50).required())
      .prop('website', S.string().format(S.FORMATS.URI).required())
      .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  )

  fastify.addSchema(
    S.object()
      .id('managerSchemaResponse')
      .title('Manager response schema')
      .description('Schema for manager response validation')
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
      .title('Manager multipart schema')
      .description('Schema for manager upload logo validation')
      .prop('name', S.object().required().prop('value', S.string().required()))
      .prop('description', S.object().required().prop('value', S.string().required()))
      .prop('website', S.object().required().prop('value', S.string().required()))
      .prop('email', S.object().required().prop('value', S.string().format(S.FORMATS.EMAIL).required()))
      .prop('logo', S.object().required().prop('file', S.object().required()))
  )
})
