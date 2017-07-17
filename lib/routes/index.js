'use strict'
const path = require('path')
const publicResourcesRoutes = require('./publicResourcesRouter.js')
const PUBLIC_DIR = path.join(__dirname, '../..', '/public')
const express = require('express')

module.exports = app => {
  return publicResourcesRoutes()
        .then((router) => {
          app.use('/public', express.static(PUBLIC_DIR))

          app.use('/', router)

          app.use('/*', (req, res, next) => {
            next({statusCode: 400, msg: 'Invalid route'})
          })

          app.use((err, req, res, next) => {
            const responseError = err.msg || err
            const statusCode = err.statusCode || 500
            res.header('Content-Type', 'application/json')
            return res.status(statusCode).end(JSON.stringify({error: responseError}))
          })
        })
}
