"use strict";
const path = require('path');
const express = require('express');
const router = express.Router();
const mapCtrl = require('../controllers/mapController.js');

const PUBLIC_DIR = path.resolve(__dirname, '../../', 'public');

const mapEndpoints = () => {

    router.get('/', (req, res) => {
		res.sendFile(PUBLIC_DIR + '/index.html');
	});

    router.get('/:style/:z/:x/:y', (req, res) => {
        console.dir(req.params);
        const z = req.params.z;
        const x = req.params.x;
        const y = req.params.y.substr(0, req.params.y.indexOf('.'));
        const format = req.params.y.substr(req.params.y.indexOf('.')+1);
        const style = req.params.style;
        mapCtrl
        .loadMap(z, x, y, style, format)
        .then(buff => {
            res.write(buff);
            res.end();
        })
        .catch(err => {
            console.dir(err);
            res.end(err);
        });
    });
}

module.exports = () => {
    return Promise.resolve()
        .then(() => {
            return mapEndpoints();
        })
        .then(() => {
            return router;
        });
};
