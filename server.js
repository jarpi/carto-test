'use strict'

const express = require('express')
const app = express()
const port = 8888
const routes = require('./lib/routes/index.js')

const initHttp = () => {
  return new Promise((resolve, reject) => {
    app.listen(port, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve(true)
    })
  })
}

initHttp()
    .then(() => {
      console.log('app initialized on port ' + port)
    })
    .then(() => {
      return routes(app)
    })
    .catch((err) => {
      console.dir(err)
    })

module.exports = app
