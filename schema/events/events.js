'use strict'

const S = require('fluent-json-schema')
const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
    
    const { ObjectId } = fastify.mongo

    fastify.addSchema(
        S.object()
            .id('#eventSchema')
            .title('Schema for event')
            .prop('name', S.string().required())
            .prop('description', S.string().required())
            .prop('images', S.string().required())
            .prop('categories', S.array().required())
            .prop('manager', S.string().required())
            .prop('state', S.boolean().default(true).required())
            .prop('maxInvited', S.integer().maximum(10).required())
            .prop('dateTime', S.string().required())
            .prop('duration', S.string().required())
            .prop('type', S.string().default('Online').required())
            .prop('tags', S.array().required())
            .prop('address', S.string().required())
            .prop('link', S.string().required())
            .prop('isPublic', S.boolean().required())
    )

    fastify.addSchema(
        S.object()
            .id('#eventSchemaResponse')
            .title('Schema for event response')
            .prop('_id', S.string())
            .prop('name', S.string())
            .prop('description', S.string())
            .prop('images', S.string())
            .prop('categories', S.array().items(S.ref('#categorySchemaResponse')))
            .prop('manager', S.string())
            .prop('state', S.boolean())
            .prop('maxInvited', S.integer())
            .prop('dateTime', S.string())
            .prop('duration', S.string())
            .prop('type', S.string())
            .prop('tags', S.string())
            .prop('address', S.string())
            .prop('link', S.string())
            .prop('isPublic', S.boolean())
    )


})