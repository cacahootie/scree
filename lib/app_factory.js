'use strict'

const fs = require('fs'),
      path = require('path')

const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser')

const configuration = require('./configuration').get_env,
      backends = require('./backends'),
      validator = require('./validator').validator,
      itemHandler = require('../handlers/items').itemHandler


exports.get_instance = function(save_dir, NODE_ENV) {
    let app = express()

    app.locals.env = configuration(save_dir, NODE_ENV)
    app.locals.backend = backends.fileBackend(app)
    validator(app)

    app.use("/static", express.static(app.locals.env.static_path))
    app.use(bodyParser.json())
    app.post("/:schema", itemHandler(app))
    app.use(morgan)

    return app
}

exports.get_running = function() {
    let app = exports.get_instance()
    return app.listen(app.env.PORT, '127.0.0.1', function(e) {
        console.log("Running scree on port: " + app.env.PORT)
    })
}
