'use strict';

const fs = require('fs');
const express = require('express');
const app = express();
const port = 8888;
const routes = require('./lib/routes/index.js');

const PUBLIC_DIR = '/public';

app.use('/public', express.static(__dirname + PUBLIC_DIR));

function initHttp() {
    return new Promise(function(resolve, reject) {
        app.listen(port, function(err) {
            if (err) {
                return reject(err);
            }
            return resolve(true);
        });
    });
}

initHttp()
    .then(function() {
        console.log('app initialized on port ' + port);
    })
    .then(function() {
        return routes(app);
    })
    .catch(function(err) {
        console.dir(err);
    });

