const path = require('path')
const mapnik = require('mapnik')
const SphericalMercator = require('sphericalmercator')
const mercator = new SphericalMercator({ size: 256 })

mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'))

const TILE_SIZE = 256
const ASSETS_DIR = path.resolve(__dirname, '../../', 'lib/assets/')
const COORD_Y_AND_FORMAT_RE = /((\d+)\.([A-z]+))/
const MIN_ZOOM_LEVEL = 0
const MAX_ZOOM_LEVEL = 18
const SRS_PROJECTION = '900913'

const renderMap = (z, x, y, style) => {
  return validateParams(z, x, y, style)
    .then(success => {
      return loadMap(style)
    })
    .then(map => {
      const yCoord = y.match(COORD_Y_AND_FORMAT_RE)[2]
      return renderImage(map, x, yCoord, z)
    })
    .then(im => {
      const format = y.match(COORD_Y_AND_FORMAT_RE)[3]
      return encodeImage(im, format)
    })
    .catch(err => {
      throw err
    })
}

const validateParams = (z, x, yCoordAndFormat, style) => {
  return extractYParam(yCoordAndFormat)
    .then(function (matchedGroups) {
      const y = matchedGroups[2]
      const format = matchedGroups[3]
      if (!paramValueBetweenBounds(z, MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL)) return Promise.reject(new Error('Z param out of bounds'))
      const maxTilesPerZoomLevel = Math.pow(2, z) - 1
      if (!paramValueBetweenBounds(x, 0, maxTilesPerZoomLevel)) return Promise.reject(new Error('X param out of bounds'))
      if (!paramValueBetweenBounds(y, 0, maxTilesPerZoomLevel)) return Promise.reject(new Error('Y param out of bounds'))
      if (style !== 'admin0' && style !== 'admin1') return Promise.reject(new Error('Invalid style param'))
      if (format !== 'png') return Promise.reject(new Error('Invalid format param'))
      return true
    })
}

const paramValueBetweenBounds = (param, minBound, maxBound) => {
  return (param >= minBound && param <= maxBound)
}

const extractYParam = (yCoordAndFormat) => {
  const matchedGroups = yCoordAndFormat.match(COORD_Y_AND_FORMAT_RE)
  if (!matchedGroups) return Promise.reject(new Error('Invalid Y coord'))
  if (!matchedGroups[2]) return Promise.reject(new Error('Invalid Y coord'))
  if (!matchedGroups[3]) return Promise.reject(new Error('Invalid format'))
  return Promise.resolve(matchedGroups)
}

const loadMap = style => {
  const map = new mapnik.Map(TILE_SIZE, TILE_SIZE)
  return new Promise((resolve, reject) => {
    map.load(`${ASSETS_DIR}/${style}/style-${style}.xml`, (err, map) => {
      if (err) return reject(err)
      return resolve(map)
    })
  })
}

const renderImage = (map, x, y, z) => {
  const im = new mapnik.Image(TILE_SIZE, TILE_SIZE)
  const square = mercator.bbox(x, y, z, false, SRS_PROJECTION)
  map.extent = square
  return new Promise((resolve, reject) => {
    map.render(im, (err, im) => {
      if (err) return reject(err)
      return resolve(im)
    })
  })
}

const encodeImage = (im, format) => {
  return new Promise((resolve, reject) => {
    im.encode(format, (err, buffer) => {
      if (err) return reject(err)
      return resolve(buffer)
    })
  })
}

module.exports = {loadMap: renderMap}
