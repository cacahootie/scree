
const mustache = require('mustache')

exports.itemHandler = function itemHandler (req, res) {
    const app = req.app
          schema = app.locals.backend.schemata[req.params.schema],
          pkey = mustache.render(schema.primaryKey, req.body)

    app.locals.backend.saveItem(req.params.schema, pkey, req.body, err => {
        if (err) {
            console.error(err)
            return res.status(500).send("Item Not Saved")
        }
        return res.end("good")
    })
    return
}
