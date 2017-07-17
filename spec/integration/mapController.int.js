'use strict'
const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const app = require('../../server.js')

describe('API tests', () => {
  it('Should return 400 for invalid endpoint', (done) => {
    request(app)
        .get('/test')
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).to.be.equal(400)
          expect(res.body.error).to.be.equal('Invalid route')
          done()
        })
  })

  it('Should return 400 for invalid param style in /style/z/x/y', (done) => {
    request(app)
        .get('/admin2/0/0/0.png')
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).to.be.equal(400)
          expect(res.body.error).to.be.equal('Invalid style param')
          done()
        })
  })

  it('Should return 400 for invalid param Z in /style/z/x/y', (done) => {
    request(app)
        .get('/admin0/-1/1/2.png')
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).to.be.equal(400)
          expect(res.body.error).to.be.equal('Z param out of bounds')
          done()
        })
  })

  it('Should return 400 for invalid param X in /style/z/x/y', (done) => {
    request(app)
        .get('/admin0/4/99/2.png')
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).to.be.equal(400)
          expect(res.body.error).to.be.equal('X param out of bounds')
          done()
        })
  })

  it('Should return 400 for invalid param X in /style/z/x/y', (done) => {
    request(app)
        .get('/admin0/0/0/2.png')
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).to.be.equal(400)
          expect(res.body.error).to.be.equal('Y param out of bounds')
          done()
        })
  })

  it('Should return 400 for invalid param Y (tile number) in /style/z/x/y', (done) => {
    request(app)
        .get('/admin0/0/1/.xml')
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).to.be.equal(400)
          expect(res.body.error).to.be.equal('Invalid Y coord')
          done()
        })
  })

  it('Should return 400 for invalid param Y (format) in /style/z/x/y', (done) => {
    request(app)
        .get('/admin0/0/1/3.')
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).to.be.equal(400)
          expect(res.body.error).to.be.equal('Invalid Y coord')
          done()
        })
  })
})
