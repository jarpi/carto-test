'use strict'

const express = require('express')
const app = express()
const port = 8888
const routes = require('./lib/routes/index.js')

const initHttp = () => {
    return routes(app)
        .then(_ => {
            app.listen(port, (err) => {
                if (err) {
                    throw (err)
                }
                return true
            })
        })
}

initHttp()
    .then(() => {
        console.log('app initialized on port ' + port)
    })
    .catch((err) => {
        console.dir(err)
    })

module.exports = app
