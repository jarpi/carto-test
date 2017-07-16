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
        const y = req.params.y;
        const style = req.params.style;
        mapCtrl
        .loadMap(z, x, y, style)
        .then(buff => {
            res.write(buff);
            res.end();
        })
        .catch(err => {
            if (err['statusCode'] && err['msg']) return res.status(err.statusCode).end(err.msg);
            return res.status(500).end(JSON.stringify(err));
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
