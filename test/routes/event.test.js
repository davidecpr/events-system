'use strict'

const { test } = require('tap')
const {
  build, testWithLogin
} = require('../helper')

const path = require('path')
const FormData = require('form-data')
const fs = require('fs')

const successFilePath = path.join(__dirname, '../test.png')
const errorFilePath = path.join(__dirname, '../test.json')

// Create

test('cannot create event, empty body', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {

    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, without login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 401)
})

test('cannot create event, wrong name, too short', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'ev',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong name, too long', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong description, too short', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'de',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong description, too long', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrzione evento di test di test di test di test di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong category', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '1111111111116994534a5',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong manager', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '1111111111116994534a5',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong state', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'test',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong maxInvited', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 0,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong dateTime', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: 'test',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong dateTime format', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01 10:00',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong startDateTime', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: 'test',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong startDateTime format', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01 10:00',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong endDateTime', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: 'test',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong endDateTime format', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01 10:00',
      type: 'Offline',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong type', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'test',
      tags: ['test, tag'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong tags, not array', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: 'test',
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong tags, empty array', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: [],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong street', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'test',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong streetName', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'test',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong number', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 0,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong country', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Ita',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong city', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'An',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong zipcode', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '123',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong link', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'test',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create event, wrong isPublic', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: 'test'
    }
  })

  t.equal(res.statusCode, 400)
})

testWithLogin('cannot create event, category not found', async (t, inject) => {
  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e356',
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('cannot create event, manager not found', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const res = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: '601024ab43d29b1cf1d7e356',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('cannot create event, endDate less than startDate ', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2020-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 500)
})

testWithLogin('cannot create event, endDate equal than startDate ', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-01T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 500)
})

testWithLogin('create event ', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res.body)
  t.equal(res.statusCode, 200)
  t.equal(newEvent.name, 'evento di test')
  t.equal(newEvent.description, 'descrizione di test')
  t.equal(newEvent.category, `${JSON.parse(category.body)._id}`)
  t.equal(newEvent.manager, `${JSON.parse(manager.body)._id}`)
  t.equal(newEvent.state, 'Bozza')
  t.equal(newEvent.maxInvited, 5)
  t.equal(newEvent.dateTime, '2021-01-01T10:00:00.000Z')
  t.equal(newEvent.startDateTime, '2021-01-01T10:00:00.000Z')
  t.equal(newEvent.endDateTime, '2021-01-15T10:00:00.000Z')
  t.equal(newEvent.type, 'Offline')
  t.equal(newEvent.tags.length, 1)
  t.equal(newEvent.street, 'Via')
  t.equal(newEvent.streetName, 'Michelangelo Buonarroti')
  t.equal(newEvent.number, 14)
  t.equal(newEvent.country, 'Italia')
  t.equal(newEvent.city, 'Angri')
  t.equal(newEvent.zipcode, '84010')
  t.equal(newEvent.link, 'https://google.it')
  t.equal(newEvent.isPublic, true)

  const resAlreadyExists = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(resAlreadyExists.statusCode, 400)
})

// Read

test('cannot read event, wrong id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/events/1111111111116994534a5'
  })

  t.equal(res.statusCode, 400)
})

test('cannot read event, not found', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/events/601024ab43d29b1cf1d7e356'
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('get event', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res.body)
  const eventResponse = await inject({
    method: 'GET',
    url: `/events/${newEvent._id}`
  })
  const event = JSON.parse(eventResponse.body)
  t.deepEqual(newEvent, event)
  t.equal(eventResponse.statusCode, 200)
})

testWithLogin('get all event', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-02-01T10:00:00Z',
      startDateTime: '2021-02-01T10:00:00Z',
      endDateTime: '2021-02-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-02-01T10:00:00Z',
      startDateTime: '2021-02-01T10:00:00Z',
      endDateTime: '2021-02-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const res = await inject({
    method: 'POST',
    url: '/events/all',
    body: {

    }
  })

  t.equal(res.statusCode, 200)
  t.equal(JSON.parse(res.body).length, 2)
})

// Edit

test('cannot edit event, without login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'PUT',
    url: '/api/events/601024ab43d29b1cf1d7e357',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e357',
      manager: '601024ab43d29b1cf1d7e357',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-02-01T10:00:00Z',
      startDateTime: '2021-02-01T10:00:00Z',
      endDateTime: '2021-02-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 401)
})

test('cannot edit event, wrong id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'PUT',
    url: '/api/events/1111111111116994534a5',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e357',
      manager: '601024ab43d29b1cf1d7e357',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-02-01T10:00:00Z',
      startDateTime: '2021-02-01T10:00:00Z',
      endDateTime: '2021-02-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot edit event, empty body', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'PUT',
    url: '/api/events/601024ab43d29b1cf1d7e357',
    body: {

    }
  })

  t.equal(res.statusCode, 400)
})

testWithLogin('cannot edit event, not found', async (t, inject) => {
  const res = await inject({
    method: 'PUT',
    url: '/api/events/601024ab43d29b1cf1d7e357',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: '601024ab43d29b1cf1d7e357',
      manager: '601024ab43d29b1cf1d7e357',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-02-01T10:00:00Z',
      startDateTime: '2021-02-01T10:00:00Z',
      endDateTime: '2021-02-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('cannot edit event, category not found', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const res = await inject({
    method: 'PUT',
    url: `/api/events/${newEvent._id}`,
    body: {
      name: 'evento di test',
      description: 'descrizione di test modifica',
      category: '601024ab43d29b1cf1d7e357',
      manager: `${newEvent.manager}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('cannot edit event, manager not found', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const res = await inject({
    method: 'PUT',
    url: `/api/events/${newEvent._id}`,
    body: {
      name: 'evento di test',
      description: 'descrizione di test modifica',
      category: `${newEvent.category}`,
      manager: '601024ab43d29b1cf1d7e357',
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('edit event', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const res = await inject({
    method: 'PUT',
    url: `/api/events/${newEvent._id}`,
    body: {
      name: 'evento di test',
      description: 'descrizione di test modifica',
      category: `${newEvent.category}`,
      manager: `${newEvent.manager}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const editEvent = JSON.parse(res.body)
  t.equal(res.statusCode, 200)
  t.equal(editEvent.name, 'evento di test')
  t.equal(editEvent.description, 'descrizione di test modifica')
  t.equal(editEvent.category, `${newEvent.category}`)
  t.equal(editEvent.manager, `${newEvent.manager}`)
  t.equal(editEvent.state, 'Bozza')
  t.equal(editEvent.maxInvited, 5)
  t.equal(editEvent.dateTime, '2021-01-01T10:00:00Z')
  t.equal(editEvent.startDateTime, '2021-01-01T10:00:00Z')
  t.equal(editEvent.endDateTime, '2021-01-15T10:00:00Z')
  t.equal(editEvent.type, 'Offline')
  t.equal(editEvent.tags.length, 1)
  t.equal(editEvent.street, 'Via')
  t.equal(editEvent.streetName, 'Michelangelo Buonarroti')
  t.equal(editEvent.number, 14)
  t.equal(editEvent.country, 'Italia')
  t.equal(editEvent.city, 'Angri')
  t.equal(editEvent.zipcode, '84010')
  t.equal(editEvent.link, 'https://google.it')
  t.equal(editEvent.isPublic, true)

  const resAlreadyExists = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test modifica',
      category: `${newEvent.category}`,
      manager: `${newEvent.manager}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  t.equal(resAlreadyExists.statusCode, 400)
})

// delete

test('cannot delete event, without login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'DELETE',
    url: '/api/events/601024ab43d29b1cf1d7e357'
  })

  t.equal(res.statusCode, 401)
})

test('cannot delete event, wrong id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'DELETE',
    url: '/api/events/1111111111116994534a5'
  })

  t.equal(res.statusCode, 400)
})

testWithLogin('cannot delete event, not found', async (t, inject) => {
  const res = await inject({
    method: 'DELETE',
    url: '/api/events/601024ab43d29b1cf1d7e357'
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('delete event', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const res = await inject({
    method: 'DELETE',
    url: `/api/events/${newEvent._id}`
  })

  t.equal(res.statusCode, 201)
})

// photos

test('cannot add photos, without login', async (t) => {
  const app = build(t)

  const form = new FormData()
  form.append('photos', fs.createReadStream(successFilePath))

  const res = await app.inject({
    method: 'POST',
    url: '/api/events/photos/601024ab43d29b1cf1d7e357',
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 401)
})

test('cannot add photos, no id', async (t) => {
  const app = build(t)

  const form = new FormData()
  form.append('photos', fs.createReadStream(successFilePath))

  const res = await app.inject({
    method: 'POST',
    url: '/api/events/photos/',
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 400)
})

test('cannot add photos, wrong id', async (t) => {
  const app = build(t)

  const form = new FormData()
  form.append('photos', fs.createReadStream(successFilePath))

  const res = await app.inject({
    method: 'POST',
    url: '/api/events/photos/1111111111116994534a5',
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 400)
})

test('cannot add photos, wrong parameter name', async (t) => {
  const app = build(t)

  const form = new FormData()
  form.append('test', fs.createReadStream(successFilePath))

  const res = await app.inject({
    method: 'POST',
    url: '/api/events/photos/601024ab43d29b1cf1d7e357',
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 400)
})

testWithLogin('cannot add photos, event not found', async (t, inject) => {
  const form = new FormData()
  form.append('photos', fs.createReadStream(successFilePath))

  const res = await inject({
    method: 'POST',
    url: '/api/events/photos/601024ab43d29b1cf1d7e357',
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('cannot add photos, no file uploaded', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const form = new FormData()

  const res = await inject({
    method: 'POST',
    url: `/api/events/photos/${newEvent._id}`,
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 400)
})

// single photo

testWithLogin('cannot add photo, wrong file type', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const form = new FormData()
  form.append('photos', fs.createReadStream(errorFilePath))

  const res = await inject({
    method: 'POST',
    url: `/api/events/photos/${newEvent._id}`,
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 500)
})

testWithLogin('add photo', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const form = new FormData()
  form.append('photos', fs.createReadStream(successFilePath))

  const res = await inject({
    method: 'POST',
    url: `/api/events/photos/${newEvent._id}`,
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 200)
})

// multiple photos

testWithLogin('cannot add phots, one file wrong type', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const form = new FormData()
  form.append('photos', fs.createReadStream(successFilePath))
  form.append('photos', fs.createReadStream(errorFilePath))

  const res = await inject({
    method: 'POST',
    url: `/api/events/photos/${newEvent._id}`,
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 500)
})

testWithLogin('add photos', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const form = new FormData()
  form.append('photos', fs.createReadStream(successFilePath))
  form.append('photos', fs.createReadStream(successFilePath))

  const res = await inject({
    method: 'POST',
    url: `/api/events/photos/${newEvent._id}`,
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 200)
})

// get photos

test('cannot get photos, wrong event id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/events/photo/1111111111116994534a5/test.png'
  })

  t.equal(res.statusCode, 400)
})

test('cannot get photos, wrong photo', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/events/photo/1111111111116994534a5/test'
  })

  t.equal(res.statusCode, 400)
})

test('cannot get photos, event not found', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/events/photo/601024ab43d29b1cf1d7e357/test.png'
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('get photos', async (t, inject) => {
  const category = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const manager = await inject({
    method: 'POST',
    url: '/api/managers',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const res200 = await inject({
    method: 'POST',
    url: '/api/events',
    body: {
      name: 'evento di test',
      description: 'descrizione di test',
      category: `${JSON.parse(category.body)._id}`,
      manager: `${JSON.parse(manager.body)._id}`,
      state: 'Bozza',
      maxInvited: 5,
      dateTime: '2021-01-01T10:00:00Z',
      startDateTime: '2021-01-01T10:00:00Z',
      endDateTime: '2021-01-15T10:00:00Z',
      type: 'Offline',
      tags: ['test'],
      street: 'Via',
      streetName: 'Michelangelo Buonarroti',
      number: 14,
      country: 'Italia',
      city: 'Angri',
      zipcode: '84010',
      link: 'https://google.it',
      isPublic: true
    }
  })

  const newEvent = JSON.parse(res200.body)

  const form = new FormData()
  form.append('photos', fs.createReadStream(successFilePath))
  form.append('photos', fs.createReadStream(successFilePath))

  const res = await inject({
    method: 'POST',
    url: `/api/events/photos/${newEvent._id}`,
    body: form,
    headers: form.getHeaders()
  })

  for (const photo of JSON.parse(res.body)) {
    const res = await inject({
      method: 'GET',
      url: `/events/photo/${newEvent._id}/${photo.url}`
    })

    t.equal(res.statusCode, 200)
  }
})
