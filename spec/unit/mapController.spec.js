'use strict'
/* eslint-env mocha */
const fs = require('fs')
const chai = require('chai')
require('should')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const mapCtrl = require('../../lib/controllers/mapController.js')
const imageDiff = require('image-diff')
const TEST_IMG_PATH = 'data/map.png'
const TEST_IMG_DIFF_PATH = 'data/map.png'
const TEST_IMG_PATH_GENERATED = 'spec/unit/generated/map.png'

describe('mapContRoller', () => {
  it('Should reject params with invalid Z', () => {
    return mapCtrl.loadMap(-1, 0, '0.png', 'admin0')
                .should.be.rejected()
  })

  it('Should reject params with invalid X', () => {
    return mapCtrl.loadMap(0, 2, '0.png', 'admin0')
                .should.be.rejected()
  })

  it('Should reject params with invalid Y - alpha instead of num', () => {
    return mapCtrl.loadMap(0, 0, 'a.png', 'admin0')
                .should.be.rejected()
  })

  it('Should reject params with invalid Y - invalid format', () => {
    return mapCtrl.loadMap(0, 0, '2.xml', 'admin0')
                .should.be.rejected()
  })

  it('Should reject params with invalid style', () => {
    return mapCtrl.loadMap(0, 0, '2.xml', 'non-existing-style')
                .should.be.rejected()
  })

  it('Should generate world map of 256x256 with admin0 style in png format', () => {
    return mapCtrl.loadMap(0, 0, '0.png', 'admin0')
        .then(function (imgBuffer) {
          return fs.writeFile(TEST_IMG_PATH_GENERATED, imgBuffer, null, (err) => {
            if (err) throw err
            return true
          })
        })
        .then(function () {
          return imageDiff({
            actualImage: TEST_IMG_PATH_GENERATED,
            expectedImage: TEST_IMG_PATH,
            diff: TEST_IMG_DIFF_PATH
          }, (err, areSame) => {
            if (err || !areSame) throw new Error('Images are not the same')
            return areSame
          })
        })
  })
})
