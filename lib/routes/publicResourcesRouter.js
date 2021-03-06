'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const mapCtrl = require('../controllers/mapController.js')

const PUBLIC_DIR = path.resolve(__dirname, '../../', 'public')

const mapEndpoints = () => {
  router.get('/', (req, res) => {
    res.sendFile(PUBLIC_DIR + '/index.html')
  })

  router.get('/:style/:z/:x/:y.:ext', (req, res, next) => {
    console.dir(req.params)
    const z = req.params.z
    const x = req.params.x
    const y = req.params.y
    const ext = req.params.ext
    const style = req.params.style
    mapCtrl
        .loadMap(z, x, y, ext,  style)
        .then(buff => {
          res.write(buff)
          res.end()
        })
        .catch(err => {
          return next({statusCode: 400, msg: err.message})
        })
  })
}

module.exports = () => {
  return Promise.resolve()
        .then(() => {
          return mapEndpoints()
        })
        .then(() => {
          return router
        })
}
