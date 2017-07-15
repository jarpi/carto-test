"use strict";
const path = require('path');
const express = require('express');
const router = express.Router();
const mapCtrl = require('../controllers/mapController.js');
const mapnik = require('mapnik');
const SphericalMercator = require('sphericalmercator');
const mercator = new SphericalMercator({ size:256 });


const PUBLIC_DIR = path.resolve(__dirname, '../../', 'public');
const ASSETS_DIR = path.resolve(__dirname, '../../', 'lib/assets/');
const TILE_SIZE = 256;

mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'));

function mapEndpoints() {

	router.get('/', function(req, res){
		res.sendFile(PUBLIC_DIR + '/index.html');
	});

	router.get('/:style/:z/:x/:y', function(req, res) {
		const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
		map.load(`${ASSETS_DIR}/${req.params.style}/style-${req.params.style}.xml`, function(err, map) {
			console.dir(req.params);
			const z = req.params.z;
			const x = req.params.x;
			const y = req.params.y.substr(0, req.params.y.indexOf('.'));
			const format = req.params.y.substr(req.params.y.indexOf('.')+1);
			console.dir(`Z: ${z} X: ${x} Y: ${y} format: ${format}`);
			const square = mercator.bbox(x, y, z, false, '900913');
			console.dir(map);
			map.extent = square;
			const im = new mapnik.Image(TILE_SIZE, TILE_SIZE);
			map.render(im, function(err, im) {
				im.encode(format, function(err, buffer) {
					res.write(buffer);
					res.end();
				 });
			});
		 });
	});

}

module.exports = function() {
    return Promise.resolve()
        .then(function() {
            return mapEndpoints();
        })
        .then(function() {
            return router;
        });
};
