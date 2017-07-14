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

// const TILE_SIZE = 4096;

const TILE_SIZE = 256;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/:style/:z/:x/:y', function(req, res) {
    const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
    map.load('./style-admin0.xml', function(err, map) {
        // console.dir(map.__proto__);
        // console.dir(map);
        // map.zoomAll();
        // map.extent = [310746, 5048810, 1214565, 5753452];
        console.dir(req.params);
        const z = req.params.z;
        const x = req.params.x;
        const y = req.params.y.substr(0, req.params.y.indexOf('.'));
        const format = req.params.y.substr(req.params.y.indexOf('.'));
        console.dir(`Z: ${z} X: ${x} Y: ${y} format: ${format}`);
        const square = mercator.bbox(x, y, z, false, '900913');
        map.extent = square;
        console.dir(map);
        const im = new mapnik.Image(TILE_SIZE, TILE_SIZE);
        map.render(im, function(err, im) {
            im.encode('png', function(err, buffer) {
                // fs.writeFile('map.png', buffer);
                res.write(buffer);
                res.end();
             });
        });
     });

    console.log('Successful get');
    // res.end('OK!');
});

app.listen(port, function(err){
    if (err) console.dir('Error initializing server');
    console.log('Server listening at ' + port);
});


