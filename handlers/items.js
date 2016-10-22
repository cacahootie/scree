
const mustache = require('mustache')

exports.itemHandler = function itemHandler (app) {
    return (req, res) => {
        let result = app.locals.ajv.validate(req.params.schema, req.body)
        console.log(result)
        console.error({ errors: app.locals.ajv.errors })
        console.log('doodoo')
        if (result === true) {
            let schema = app.locals.backend.schemata[req.params.schema],
                pkey = mustache.render(schema.primaryKey, req.body)
            app.locals.backend.saveItem(schema, pkey, req.body, err => {
                console.log("HELLO!")
                if (err) {
                    console.error(err)
                    return res.status(500).send("Problem!")
                }
                return res.end("good")
            })
            return
        } else {
            return res
                .status(400)
                .send({ errors: app.locals.ajv.errors })
        }
    }
}