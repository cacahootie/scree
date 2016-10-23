'use strict'

const mustache = require('mustache')

exports.createItem = function createItem (req, res) {
    const app = req.app,
          schema = app.locals.backend.schemata[req.params.schema]

    let itemName = null
    if (req.params.itemName) {
        itemName = req.params.itemName
    } else {
        itemName = mustache.render(schema.primaryKey, req.body)
    }

    app.locals.backend.saveItem(req.params.schema, itemName, req.body, err => {
        if (err) {
            console.error(err)
            return res.status(500).send("Item Not Saved")
        }
        return res.end("good")
    })
    return
}

exports.getSchema = function getSchema (req, res) {
    res.json(req.app.locals.backend.getSchema(req.params.schema))
}

exports.getItem = function getItem (req, res) {
    req.app.locals.backend.getItem(
        req.params.schema,
        req.params.itemName,
        (e, d) => {
            if (e) return res.status(404).end("error, no data")
            res.json(d)
        }
    )
}
