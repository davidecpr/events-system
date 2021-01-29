'use strict'

const { test } = require('tap')
const { 
  build
} = require('../helper')

test('cannot create auth User', async (t) => {
  const app = build(t)

  const res400 = await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'davidecpr',
      fullName: 'Davide Capriglione'
    }
  })

  t.equal(res400.statusCode, 400)
})

test('create auth User', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'davidecpr',
      fullName: 'Davide Capriglione',
      password: 'testPassword'
    }
  })

  t.equal(res.statusCode, 200)
  t.equal(typeof JSON.parse(res.body), 'object')
  t.equal(typeof JSON.parse(res.body).token, 'string')

})

test('create user and Login', async (t) =>{
  const app = build(t)

  await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'davidecpr',
      fullName: 'Davide Capriglione',
      password: 'testPassword'
    }
  })

  const res = await app.inject({
    method: 'POST',
    url: '/signin',
    body: {
      username: 'davidecpr',
      password: 'testPassword'
    }
  })

  t.equal(res.statusCode, 200)
  t.equal(typeof JSON.parse(res.body), 'object')
  t.equal(typeof JSON.parse(res.body).token, 'string')
})

test('create user and bad login', async (t) => {
  const app = build(t)

  await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'davidecpr',
      fullName: 'Davide Capriglione',
      password: 'testPassword'
    }
  })

  const res404 = await app.inject({
    method: 'POST',
    url: '/signin',
    body: {
      username: 'davidecpr1',
      password: 'testPassword'
    }
  })

  t.equal(res404.statusCode, 404)

  const res400 = await app.inject({
    method: 'POST',
    url: '/signin',
    body: {
      username: 'davidecpr',
      password: 'test'
    }
  })

  t.equal(res400.statusCode, 400)

})

test('create user and bad request', async (t) => {
  const app = build(t)

  await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'davidecpr',
      fullName: 'Davide Capriglione',
      password: 'testPassword'
    }
  })

  const res = await app.inject({
    method: 'POST',
    url: '/signin',
    body: {
      username: 'davidecpr'
    }
  })

  t.equal(res.statusCode, 400)

})