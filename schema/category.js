'use strict'

const S = require('fluent-json-schema')
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.addSchema(
    S.object()
      .id('categorySchema')
      .title('Category schema')
      .description('Schema for category validation')
      .prop('name', S.string().minLength(5).maxLength(15).required())
      .prop('slug', S.string().minLength(5).maxLength(30).required())
      .prop('description', S.string().minLength(5).maxLength(50).required())
      .prop('icon', S.raw({ type: 'string', pattern: 'fa-[a-zA-Z0-9-]+' }).required())
  )

  fastify.addSchema(
    S.object()
      .id('categorySchemaResponse')
      .title('Category response schema')
      .description('Schema for category response validation')
      .prop('_id', S.string())
      .prop('name', S.string())
      .prop('slug', S.string())
      .prop('description', S.string())
      .prop('icon', S.string())
  )
})
