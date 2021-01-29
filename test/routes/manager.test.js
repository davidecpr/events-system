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

testWithLogin('create manager', async (t, inject) => {
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

// Read

test('cannot get manager, wrong id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/managers/1111111111116994534a5'
  })

  t.equal(res.statusCode, 400)
})

test('cannot get manager, no id', async (t) => {
    const app = build(t)
  
    const res = await app.inject({
      method: 'GET',
      url: '/managers/'
    })
  
    t.equal(res.statusCode, 400)
})

test('cannot get manager, not found', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/managers/601024ab43d29b1cf1d7e356'
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('get manager', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/managers/',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const newManager = JSON.parse(response.body)
  const managerResponse = await inject({
    method: 'GET',
    url: `/managers/${newManager._id}`
  })
  const manager = JSON.parse(managerResponse.body)
  t.deepEqual(newManager, manager)
  t.equal(managerResponse.statusCode, 200)
})

testWithLogin('get all managers', async (t, inject) => {
  await inject({
    method: 'POST',
    url: '/api/managers/',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  await inject({
    method: 'POST',
    url: '/api/managers/',
    body: {
      name: 'test manager 1',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test1@test.it'
    }
  })

  const res = await inject({
    method: 'GET',
    url: '/managers/all'
  })

  t.equal(res.statusCode, 200)
  t.equal(JSON.parse(res.body).length, 2)
})

//Edit

test('cannot edit manager, without login', async(t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'PUT',
        url: '/api/managers/601024ab43d29b1cf1d7e357',
        body: {
            name: 'test manager',
            description: 'descrizione di prova',
            website: 'https://google.it',
            email: 'test@test.it'
        }
    })

    t.equal(res.statusCode, 401)
})

test('cannot edit manager, wrong id', async(t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'PUT',
        url: '/api/managers/1111111111116994534a5',
        body: {
            name: 'test manager',
            description: 'descrizione di prova',
            website: 'https://google.it',
            email: 'test@test.it'
        }
    })

    t.equal(res.statusCode, 400)
})

test('cannot edit manager, empty body', async(t) => {
    const app = build(t)

    const res = await app.inject({
        method: 'PUT',
        url: '/api/managers/601024ab43d29b1cf1d7e357',
        body: {
            
        }
    })

    t.equal(res.statusCode, 400)
})

testWithLogin('cannot edit manager, not found', async(t, inject) => {

    const res = await inject({
        method: 'PUT',
        url: '/api/managers/601024ab43d29b1cf1d7e357',
        body: {
            name: 'test manager',
            description: 'descrizione di prova',
            website: 'https://google.it',
            email: 'test@test.it'
        }
    })

    t.equal(res.statusCode, 404)
})

testWithLogin('edit manager', async(t, inject) => {

    const response = await inject({
        method: 'POST',
        url: '/api/managers',
        body: {
          name: 'test manager',
          description: 'descrizione di prova',
          website: 'https://google.it',
          email: 'test@test.it'
        }
    })

    const newManager = JSON.parse(response.body)
    const managerResponse = await inject({
        method: 'PUT',
        url: `/api/managers/${newManager._id}`,
        body: {
            name: 'test manager',
            description: 'descrizione di prova modificata',
            website: 'https://google.it',
            email: 'test@test.it'
        }
    })
    const manager = JSON.parse(managerResponse.body)
    t.equal(managerResponse.statusCode, 200)
    t.equal(manager.name, 'test manager')
    t.equal(manager.description, 'descrizione di prova modificata')
    t.equal(manager.website, 'https://google.it')
    t.equal(manager.email, 'test@test.it')

    const res500 = await inject({
        method: 'POST',
        url: '/api/managers',
        body: {
          name: 'test manager',
          description: 'descrizione di prova',
          website: 'https://google.it',
          email: 'test@test.it'
        }
    })
})

// delete

test('cannot delete manager, without login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'DELETE',
    url: '/api/managers/601024ab43d29b1cf1d7e357'
  })

  t.equal(res.statusCode, 401)
})

test('cannot delete manager, no id', async (t) => {
    const app = build(t)
  
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/managers/'
    })
  
    t.equal(res.statusCode, 400)
})

test('cannot delete manager, wrong id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'DELETE',
    url: '/api/managers/1111111111116994534a5'
  })

  t.equal(res.statusCode, 400)
})

testWithLogin('cannot delete manager, not found', async (t, inject) => {
  const res = await inject({
    method: 'DELETE',
    url: '/api/managers/601024ab43d29b1cf1d7e357'
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('delete manager', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/managers/',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const newManager = JSON.parse(response.body)
  const managerResponse = await inject({
    method: 'DELETE',
    url: `/api/managers/${newManager._id}`
  })

  t.equal(managerResponse.statusCode, 201)
})
// logo
test('cannot add logo, without login', async (t) => {
  const app = build(t)

  const form = new FormData()
  form.append('logo', fs.createReadStream(successFilePath))

  const res = await app.inject({
    method: 'POST',
    url: '/api/managers/set/logo/601024ab43d29b1cf1d7e357',
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 401)
})

test('cannot add logo, no id', async (t) => {
    const app = build(t)
  
    const form = new FormData()
    form.append('logo', fs.createReadStream(successFilePath))
  
    const res = await app.inject({
      method: 'POST',
      url: '/api/managers/set/logo/',
      body: form,
      headers: form.getHeaders()
    })
  
    t.equal(res.statusCode, 400)
})

test('cannot add logo, wrong id', async (t) => {
  const app = build(t)

  const form = new FormData()
  form.append('logo', fs.createReadStream(successFilePath))

  const res = await app.inject({
    method: 'POST',
    url: '/api/managers/set/logo/1111111111116994534a5',
    body: form,
    headers: form.getHeaders()
  })

  t.equal(res.statusCode, 400)
})

testWithLogin('cannot add logo, manager not found', async (t, inject) => {
  const form = new FormData()
  form.append('logo', fs.createReadStream(successFilePath))

  const managerResponse = await inject({
    method: 'POST',
    url: '/api/managers/set/logo/601024ab43d29b1cf1d7e357',
    body: form,
    headers: form.getHeaders()
  })

  t.equal(managerResponse.statusCode, 404)
})

testWithLogin('cannot add logo, no file uploaded', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/managers/',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const newManager = JSON.parse(response.body)

  const form = new FormData()

  const managerResponse = await inject({
    method: 'POST',
    url: `/api/managers/set/logo/${newManager._id}`,
    body: form,
    headers: form.getHeaders()
  })

  t.equal(managerResponse.statusCode, 400)
})

testWithLogin('cannot add logo, wrong file type', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/managers/',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const newManager = JSON.parse(response.body)

  const form = new FormData()
  form.append('logo', fs.createReadStream(errorFilePath))

  const managerResponse = await inject({
    method: 'POST',
    url: `/api/managers/set/logo/${newManager._id}`,
    body: form,
    headers: form.getHeaders()
  })

  t.equal(managerResponse.statusCode, 500)
})

testWithLogin('add logo', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/managers/',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const newManager = JSON.parse(response.body)

  const form = new FormData()
  form.append('logo', fs.createReadStream(successFilePath))

  const managerResponse = await inject({
    method: 'POST',
    url: `/api/managers/set/logo/${newManager._id}`,
    body: form,
    headers: form.getHeaders()
  })

  t.equal(managerResponse.statusCode, 200)
})

test('cannot get logo, wrong id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/managers/get/logo/1111111111116994534a5'
  })

  t.equal(res.statusCode, 400)
})

test('cannot get logo, manager not found', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/managers/get/logo/601024ab43d29b1cf1d7e357'
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('get logo', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/managers/',
    body: {
      name: 'test manager',
      description: 'descrizione di prova',
      website: 'https://google.it',
      email: 'test@test.it'
    }
  })

  const newManager = JSON.parse(response.body)

  const form = new FormData()
  form.append('logo', fs.createReadStream(successFilePath))

  await inject({
    method: 'POST',
    url: `/api/managers/set/logo/${newManager._id}`,
    body: form,
    headers: form.getHeaders()
  })

  const res = await inject({
    method: 'GET',
    url: `/managers/get/logo/${newManager._id}`,
  })

  t.equal(res.statusCode, 200)
})
