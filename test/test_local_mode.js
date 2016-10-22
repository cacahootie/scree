'use strict'

const assert = require('chai').assert,
      request = require('supertest')

const app_factory = require('../lib/app_factory')


describe('json upload and validation', function(){
    let app

    beforeEach(function() {
        app = app_factory.get_instance('.', 'testing')
    })

    it('registers as testing mode', function(done) {
        if (process.env.NODE_ENV) {
            done()
        } else {
            assert(app.locals.env.NODE_ENV === 'testing')
            done()
        }
    })

    it('validates a simple example', function(done) {
        request(app)
            .post('/city')
            .send({
                "city": "Phoenix",
                "state": "Arizona",
                "zip": 85004,
                "county": "Maricopa",
                "country": "USA"
            })
            .expect(d => d === "good")
            .expect(200)
            .expect(d => {
                jsonfile.readFile(
                    'static/pub/items/city/PhoenixArizona.json',
                    (err, obj) => {
                        if (err) console.error(err)
                        assert(!err)
                        assert.deepEqual(item, obj)
                        app.locals.backend.deleteItem('city', 'PhoenixArizona', done)
                    }
                )
            })
    })

    it('fails a simple example', function(done) {
        request(app)
            .post('/city')
            .send({
                "tronald": "dump",
                "cilary": "hlinton"
            })
            .expect(d => d.body.errors.length === 5)
            .expect(400, done)
    })
})
