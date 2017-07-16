const path = require('path');
const mapnik = require('mapnik');
const SphericalMercator = require('sphericalmercator');
const mercator = new SphericalMercator({ size:256 });

mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'));

const TILE_SIZE = 256;
const ASSETS_DIR = path.resolve(__dirname, '../../', 'lib/assets/');
const COORD_Y_AND_FORMAT_RE = /((\d+)\.([A-z]+))/;
const MIN_ZOOM_LEVEL = 0;
const MAX_ZOOM_LEVEL = 18;

const renderMap = (z, x, y, style) => {
    return validateParams(z, x, y, style)
    .then(success => {
        return style;
    })
    .then(loadMap)
    .then(map => {
        const y_coord = y.match(COORD_Y_AND_FORMAT_RE)[2];
        return renderImage(map, x, y_coord, z);
    })
    .then(im => {
        const format = y.match(COORD_Y_AND_FORMAT_RE)[3];
        return encodeImage(im, format);
    })
    .catch(err => {
        throw err;
    });
}

const validateParams = (z, x, y_coord_and_format, style) => {
    const y = y_coord_and_format.match(COORD_Y_AND_FORMAT_RE)[2];
    const format = y_coord_and_format.match(COORD_Y_AND_FORMAT_RE)[3];
    if (!y) return Promise.reject({statusCode:400, msg:'Invalid Y coord'});
    if (!format) return Promise.reject({statusCode:400, msg:'Invalid format'});

    const paramsAreValid =
        (z >= MIN_ZOOM_LEVEL && z <= MAX_ZOOM_LEVEL)
        && (x >= 0 && x <= (z*2)-1)
        && (y >= 0 && y <= (z*2)-1)
        && (style === 'admin0' || style === 'admin1')
        && (format === 'png');

    if (!paramsAreValid) return Promise.reject({statusCode:400, msg:'Invalid params'});
    return Promise.resolve(paramsAreValid);
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
