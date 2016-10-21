'use strict'

const Ajv = require('ajv')

exports.validator = function validator (app) {
    let schemata = app.locals.backend.getSchemata(),
        ajv = new Ajv({
            allErrors: true
        })
    for (let schemaName of Object.keys(schemata)) {
        ajv.addSchema(
            schemata[schemaName],
            schemaName
        )
    }
    app.locals.ajv = ajv
}
