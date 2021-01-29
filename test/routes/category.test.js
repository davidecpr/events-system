'use strict'

const { test } = require('tap')
const {
  build, testWithLogin
} = require('../helper')

// Create

test('cannot create category, empty body', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/category/',
    body: {

    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create category, wrong name, too short', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/category/',
    body: {
      name: 'te',
      slug: 'nuova categoria di test',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create category, wrong name, too long', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/category/',
    body: {
      name: 'test new category',
      slug: 'nuova categoria di test',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create category, wrong slug, too short', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/category/',
    body: {
      name: 'test categoria',
      slug: 'nuo',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create category, wrong slug, too long', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/category/',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria slug nuova categoria',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create category, wrong description, too short', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/category/',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di test',
      description: 'Des',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create category, wrong description, too long', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/category/',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di test',
      description: 'Descrizione di test descrizione di test descrizione di test',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create category, wrong icon', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/category/',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di test',
      description: 'Description di test',
      icon: 'test'
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot create category, without login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/category/',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 401)
})

testWithLogin('cannot create category, duplicate name', async (t, inject) => {
  await inject({
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
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 400)
})

testWithLogin('create category', async (t, inject) => {
  const res = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 200)
  t.equal(JSON.parse(res.body).name, 'test categoria')
  t.equal(JSON.parse(res.body).slug, 'nuova categoria di prova')
  t.equal(JSON.parse(res.body).description, 'Descrizione di prova per la nuova categoria')
  t.equal(JSON.parse(res.body).icon, 'fa fa-home')
})

// Read

test('cannot get category, wrong id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/category/1111111111116994534a5'
  })

  t.equal(res.statusCode, 400)
})

test('cannot get category, not found', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/category/601024ab43d29b1cf1d7e356'
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('get category', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const newCategory = JSON.parse(response.body)
  const categoryResponse = await inject({
    method: 'GET',
    url: `/category/${newCategory._id}`
  })
  const category = JSON.parse(categoryResponse.body)
  t.deepEqual(newCategory, category)
  t.equal(categoryResponse.statusCode, 200)
})

testWithLogin('get all categories', async (t, inject) => {
  await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  await inject({
    method: 'POST',    url: '/api/category',
    body: {
      name: 'test categoria1',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const res = await inject({
    method: 'GET',
    url: '/category/all'
  })

  t.equal(res.statusCode, 200)
  t.equal(JSON.parse(res.body).length, 2)
})

// Edit

test('cannot edit category, without login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'PUT',
    url: '/api/category/601024ab43d29b1cf1d7e357',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 401)
})

test('cannot edit category, wrong id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'PUT',
    url: '/api/category/1111111111116994534a5',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 400)
})

test('cannot edit category, empty body', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'PUT',
    url: '/api/category/601024ab43d29b1cf1d7e357',
    body: {
      
    }
  })

  t.equal(res.statusCode, 400)
})

testWithLogin('cannot edit category, not found', async (t, inject) => {
  const res = await inject({
    method: 'PUT',
    url: '/api/category/601024ab43d29b1cf1d7e357',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('edit categoy', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }

  })

  const newCategory = JSON.parse(response.body)
  const categoryResponse = await inject({
    method: 'PUT',
    url: `/api/category/${newCategory._id}`,
    body: {
      name: 'categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })
  const category = JSON.parse(categoryResponse.body)
  t.equal(categoryResponse.statusCode, 200)
  t.equal(category.name, 'categoria')
  t.equal(category.slug, 'nuova categoria di prova')
  t.equal(category.description, 'Descrizione di prova per la nuova categoria')
  t.equal(category.icon, 'fa fa-home')

  const res500 = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  t.equal(res500.statusCode, 400)
})

// delete

test('cannot delete category, without login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'DELETE',
    url: '/api/category/601024ab43d29b1cf1d7e357'
  })

  t.equal(res.statusCode, 401)
})

test('cannot delete category, wrong id', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'DELETE',
    url: '/api/category/1111111111116994534a5'
  })

  t.equal(res.statusCode, 400)
})

testWithLogin('cannot delete category, not found', async (t, inject) => {
  const res = await inject({
    method: 'DELETE',
    url: '/api/category/601024ab43d29b1cf1d7e357'
  })

  t.equal(res.statusCode, 404)
})

testWithLogin('delete category', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/category',
    body: {
      name: 'test categoria',
      slug: 'nuova categoria di prova',
      description: 'Descrizione di prova per la nuova categoria',
      icon: 'fa fa-home'
    }
  })

  const newCategory = JSON.parse(response.body)
  const categoryResponse = await inject({
    method: 'DELETE',
    url: `/api/category/${newCategory._id}`
  })

  t.equal(categoryResponse.statusCode, 201)
})
