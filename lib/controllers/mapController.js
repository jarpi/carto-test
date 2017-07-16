const path = require('path');
const mapnik = require('mapnik');
const SphericalMercator = require('sphericalmercator');
const mercator = new SphericalMercator({ size:256 });

mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'));

const TILE_SIZE = 256;
const ASSETS_DIR = path.resolve(__dirname, '../../', 'lib/assets/');

const renderMap = (z, x, y, style, format) => {
    return Promise.resolve(style)
    .then(loadMap)
    .then(map => {
        return renderImage(map, x, y, z);
    })
    .then(im => {
        return encodeImage(im, format);
    })
}

const loadMap = style => {
    const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
    return new Promise((resolve, reject) => {
        map.load(`${ASSETS_DIR}/${style}/style-${style}.xml`, (err, map) => {
            if (err) return reject(err);
            return resolve(map);
        });
    });
}

const renderImage = (map, x, y, z) => {
    const im = new mapnik.Image(TILE_SIZE, TILE_SIZE);
    const square = mercator.bbox(x, y, z, false, '900913');
    map.extent = square;
    return new Promise((resolve, reject) => {
        map.render(im, (err, im) => {
            if (err) return reject(err);
            return resolve(im);
        });
    });
}

const encodeImage = (im, format) => {
    return new Promise((resolve, reject) => {
        im.encode(format, (err, buffer) => {
            if (err) return reject(err);
            return resolve(buffer);
        });
    });
}

module.exports = {loadMap: renderMap};
