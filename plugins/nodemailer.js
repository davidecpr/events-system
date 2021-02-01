'use strict'

const fp = require('fastify-plugin')
const Nodemailer = require('fastify-nodemailer')

module.exports = fp(async (fastify, opts) => {

    const options = {
        pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use TLS
        auth: {
          user: 'testevents21@gmail.com',
          pass: 'testevents123'
        }
    }

    fastify.register(Nodemailer, options)
})
