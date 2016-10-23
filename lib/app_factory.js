'use strict'

const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      cookieSession = require('cookie-session')

const configuration = require('./configuration').get_env,
      authentication = require('./authentication'),
      backends = require('./backends'),
      validator = require('./validator').validator,
      items = require('../handlers/items')


exports.get_instance = function(save_dir, NODE_ENV) {
    const app = express()

    app.locals.env = configuration(save_dir, NODE_ENV)
    app.locals.backend = backends.fileBackend(app)

    app.use(bodyParser.json())
    app.use(cookieSession({
        name: "the-sesh",
        secret: "reallysecret"
    }))

    app.get("/login", authentication.login)
    app.get("/login/user", (req, res) => res.end(req.session.user))

    app.post("/:schema", validator(app))
    app.post("/:schema", items.createItem)
    app.get("/:schema", items.getSchema)
    app.put("/:schema/:itemName", items.createItem)
    app.get("/:schema/:itemName", items.getItem)

    app.use(morgan)

    return app
}

exports.get_running = function() {
    const app = exports.get_instance()
    return app.listen(app.locals.env.PORT, '127.0.0.1', function(e) {
        console.log("Running scree on port: " + app.locals.env.PORT)
    })
}
