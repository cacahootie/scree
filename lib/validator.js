'use strict'

const Ajv = require('ajv')

exports.validator = function validator (app) {
    const schemata = app.locals.backend.getSchemata(),
          ajv = new Ajv({ allErrors: true })

    for (let schemaName of Object.keys(schemata)) {
        ajv.addSchema(
            schemata[schemaName],
            schemaName
        )
    }

    return (req, res, next) => {
        const result = ajv.validate(req.params.schema, req.body)
        if (result !== true) {
            return res
                .status(400)
                .send({ errors: ajv.errors })
        } else {
            return next()
        }
    }
}
