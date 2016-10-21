'use strict'

const assert = require('chai').assert,
      request = require('supertest'),
      jsonfile = require('jsonfile')

const configuration = require('../lib/configuration').get_env,
      backends = require('../lib/backends')


describe('file backend', function(){
    let env = configuration('.', 'testing'),
        app = {"locals": {"env": env}},
        backend = backends.fileBackend(app)

    it('gets a the schemata', function () {
        let schemata = backend.getSchemata()
        assert(schemata.city)
    })

    it('gets a schema', function () {
        let schema = backend.getSchema('city')
        assert(schema.properties.city)
        assert(schema.properties.state)
        assert(schema.properties.zip)
        assert(schema.properties.county)
        assert(schema.properties.country)
    })

    it('saves and deletes an item', function (done) {
        let item = {
            "city":"Phoenix",
            "state":"Arizona",
            "zip":85001,
            "county":"Maricopa",
            "country":"USA"
        }
        backend.saveItem('city', 'testitem', item, err => {
            assert(!err, "error saving item")
            jsonfile.readFile(
                'static/pub/items/city/testitem.json',
                (err, obj) => {
                    if (err) console.error(err)
                    assert(!err)
                    assert.deepEqual(item, obj)
                    backend.deleteItem('city', 'testitem', done)
                }
            )
        })
    })
})
