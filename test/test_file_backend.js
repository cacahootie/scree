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

    it('saves, gets and deletes an item', function (done) {
        let item = {
            "city":"Phoenix",
            "state":"Arizona",
            "zip":85001,
            "county":"Maricopa",
            "country":"USA"
        }
        backend.saveItem('city', 'testitem', item, e => {
            assert(!e)
            backend.getItem('city', 'testitem', (e, d) => {
                assert(!e)
                assert.deepEqual(item, d)
                backend.deleteItem('city', 'testitem', e => {
                    assert(!e)
                    backend.getItem('city', 'testitem', (e,d) => {
                        assert(e)
                        done()
                    })
                })
            })
        })
    })

    it('lists the items', function (done) {
        let item = {
            "city":"Phoenix",
            "state":"Arizona",
            "zip":85001,
            "county":"Maricopa",
            "country":"USA"
        }
        backend.saveItem('city', 'testitem', item, err => {
            backend.listItems('city', (err, items) => {
                assert.deepEqual(items, ['testitem'])
                backend.deleteItem('city', 'testitem', done)
            })
        })
    })

    it('returns filtered items', function(done) {
        let item = {
            "winners": [
                "george hw bush",
                "bill clinton",
                "george w bush",
                "barack obama",
                "hilary clinton"
            ]
        }
        backend.filterItems('filter_test', item, (e,d) => {
            assert(d[0].winners[0] === 'george hw bush')
            assert(d[0].losers[0] === 'michael dukakis')
            assert(d.length === 1)
            done()
        })
    })
})
