'use strict'

const fs = require('fs'),
      path = require('path')

const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      Ajv = require('ajv')

const configuration = require('./configuration').get_env


exports.get_instance = function(save_dir, NODE_ENV) {
    let app = express(),
        ajv = new Ajv(),
        router = express.Router({strict: true}),
        env = configuration(save_dir, NODE_ENV),
        static_path = path.join(env.save_dir, 'static', 'pub'),
        schemata_path = path.join(static_path, 'schemata'),
        schemaFiles = fs.readdirSync(schemata_path),
        schemata = {}

    for (let schemaFname of schemaFiles) {
        schemata[schemaFname.replace('.json', '')] = ajv.compile(
            JSON.parse(fs.readFileSync(
                path.join(static_path, 'schemata', schemaFname)
            ))
        )
    }

    app.env = env

    app.use("/", router)
    app.use("/static", express.static(static_path))
    app.use(bodyParser.json())
    app.post("/:schema", (req, res) => {
        let result = schemata[req.params.schema](req.body)
        if (result === true) {
            return res.end("good")
        } else {
            return res.end("crap")    
        }
        
    })
    app.use(morgan)

    console.log(`Static set up to ${ static_path }`)
    return app
}

exports.get_running = function() {
    let app = exports.get_instance()
    return app.listen(app.env.PORT, '127.0.0.1', function(e) {
        console.log("Running scree on port: " + app.env.PORT)
    })
}
