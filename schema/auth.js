'use strict'

const fp = require('fastify-plugin')
const S = require('fluent-json-schema')

module.exports = fp(async (fastify, opts) => {
  fastify.addSchema(
    S.object()
      .id('signupSchema')
      .title('Authentication signup schema')
      .description('Schema for user signup authentication')
      .prop('username', S.string()
        .maxLength(10)
        .description('The preferred username')
        .required())
      .prop('password', S.string()
        .description('The password')
        .required())
      .prop('fullName', S.string()
        .maxLength(50)
        .description('The name of the user')
        .required())
  )

  fastify.addSchema(
    S.object()
      .id('signinSchema')
      .title('Authentication signin schema')
      .description('Schema for user signin authentication')
      .prop('username', S.string()
        .maxLength(10)
        .description('The preferred username')
        .required())
      .prop('password', S.string()
        .description('The password')
        .required())
  )

  fastify.addSchema(
    S.object()
      .id('authSchemaResponse')
      .title('Authentication response schema')
      .description('Schema for user authentication response')
      .prop('token', S.string())
  )
})
