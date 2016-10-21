
exports.itemHandler = function itemHandler (app) {
    return (req, res) => {
        let result = app.locals.ajv.validate(req.params.schema, req.body)
        if (result === true) {
            return res.end("good")
        } else {
            return res
                .status(400)
                .send({ errors: app.locals.ajv.errors })
        }
    }
}