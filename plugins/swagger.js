'use strict'

const fp = require('fastify-plugin')
const fs = require('fs')
const Swagger = require('fastify-swagger')
const path = require('path')

module.exports = fp(async (fastify, opts) => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')))

  const options = Object.assign({
    routePrefix: '/swagger',
    exposeRoute: true,
    swagger: {
      info: {
        title: `${packageJson.name}: Example App swagger`,
        description: packageJson.description,
        version: packageJson.version
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      host: `${process.env.FASTIFY_ADDRESS}:${process.env.FASTIFY_PORT}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'Autenticazione', description: 'Authentication end-points' },
        { name: 'Eventi', description: 'Events end-points' },
        { name: 'Categorie', description: 'Categories end-points' },
        { name: 'Organizzatori', description: 'Managers end-points' }
      ],
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          value: "Bearer"
        }
      }
    }
  }, opts.swagger)


  fastify.register(Swagger, options)
})
