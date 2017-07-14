'use strict';

const fs = require('fs');
const mapnik = require('mapnik');
const path = require('path');
const SphericalMercator = require('sphericalmercator');
const mercator = new SphericalMercator({ size:256 });
const express = require('express');
const app = express();
const port = 8888;

mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'));

const TILE_SIZE = 256;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/:style/:z/:x/:y', function(req, res) {
    const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
    map.load(`./style-${req.params.style}.xml`, function(err, map) {
        console.dir(req.params);
        const z = req.params.z;
        const x = req.params.x;
        const y = req.params.y.substr(0, req.params.y.indexOf('.'));
        const format = req.params.y.substr(req.params.y.indexOf('.')+1);
        console.dir(`Z: ${z} X: ${x} Y: ${y} format: ${format}`);
        const square = mercator.bbox(x, y, z, false, '900913');
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

app.listen(port, function(err){
    if (err) console.dir('Error initializing server');
    console.log('Server listening at ' + port);
});

