'use strict'

const { test } = require('tap')
const { 
  build, testWithLogin
} = require('../helper')

//Create

test('cannot create manager, empty body', async (t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'POST',
        url: '/api/managers',
        body: {

        }
    })

    t.equal(res.statusCode, 400)
})

test('cannot create manager, wrong name, too short', async (t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'POST',
        url: '/api/managers',
        body: {
            name: 'test',
            description: 'descrizione di test',
            website: 'https://google.it',
            email: 'test@test.it'
        }
    })

    t.equal(res.statusCode, 400)
})

test('cannot create manager, wrong name, too long', async (t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'POST',
        url: '/api/managers',
        body: {
            name: 'test manager test manager',
            description: 'descrizione di test',
            website: 'https://google.it',
            email: 'test@test.it'
        }
    })

    t.equal(res.statusCode, 400)
})

test('cannot create manager, wrong description, too short', async (t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'POST',
        url: '/api/managers',
        body: {
            name: 'test manager',
            description: 'desc',
            website: 'website di test',
            email: 'test@test.it'
        }
    })

    t.equal(res.statusCode, 400)
})

test('cannot create manager, wrong description, too long', async (t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'POST',
        url: '/api/managers',
        body: {
            name: 'test manager',
            description: 'descrizione di test too long descrizione di test too long',
            website: 'website di test',
            email: 'test@test.it'
        }
    })

    t.equal(res.statusCode, 400)
})

test('cannot create manager, wrong website format', async (t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'POST',
        url: '/api/managers',
        body: {
            name: 'test manager',
            description: 'descrizione di prova',
            website: 'test website',
            email: 'test@test.it'
        }
    })

    t.equal(res.statusCode, 400)
})

test('cannot create manager, wrong email format', async (t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'POST',
        url: '/api/managers',
        body: {
            name: 'test manager',
            description: 'descrizione di prova',
            website: 'https://google.it',
            email: 'test email'
        }
    })

    t.equal(res.statusCode, 400)
})

test('cannot create manager, without login', async (t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'POST',
        url: '/api/managers',
        body: {
            name: 'test manager',
            description: 'descrizione di prova',
            website: 'https://google.it',
            email: 'test@test.it'
        }
    })

    t.equal(res.statusCode, 401)

})  

testWithLogin('create manager', async(t, inject) => {

    const res = await inject({
        method: 'POST',
        url: '/api/managers',
        body: {
            name: 'test manager',
            description: 'descrizione di prova',
            website: 'https://google.it',
            email: 'test@test.it'
        }
    })

    const manager = JSON.parse(res.body)
    t.equal(res.statusCode, 200)
    t.equal(manager.name, 'test manager')
    t.equal(manager.description, 'descrizione di prova')
    t.equal(manager.website, 'https://google.it')
    t.equal(manager.email, 'test@test.it')

})

//Read

test('cannot get manager, wrong id')


