'use strict'

const fs = require('fs'),
      path = require('path')

const mkdirp = require('mkdirp'),
      jsonfile = require('jsonfile')

exports.fileBackend = function fileBackend (app) {
    const self = {},
          schemataPath = path.join(app.locals.env.static_path, 'schemata')

    self.getSchemata = function getSchemata () {
        const schemaList = fs.readdirSync(schemataPath),
              schemata = {}
        for (let schemaFname of schemaList) {
            schemata[schemaFname.replace('.json', '')] = self.getSchema(
                schemaFname
            )
        }
        self.schemata = schemata
        return schemata
    }

    self.getSchema = function getSchema (schemaFname) {
        if (!schemaFname.endsWith('.json')) schemaFname += '.json'
        return jsonfile.readFileSync(path.join(schemataPath, schemaFname))
    }

    self.saveItem = function saveItem (schemaName, fname, item, cb) {
        const saveDir = path.join(app.locals.env.static_path, 'items', schemaName)
        mkdirp(saveDir, err => {
            if (err) return console.error(err)
            jsonfile.writeFile(path.join(saveDir, `${ fname }.json`), item, cb)
        })
    }

    self.listItems = function listItems (schemaName, cb) {
        const saveDir = path.join(app.locals.env.static_path, 'items', schemaName)
        fs.readdir(saveDir, (err, files) => {
            if (err) return cb(err, null)
            const items = []
            for (let i of files) items.push(i.replace('.json', ''))
            return cb(null, items)
        })
    }

    self.deleteItem = function deleteItem (schemaName, itemName, cb) {
        fs.unlink(
            path.join(
                app.locals.env.static_path,
                'items',
                schemaName,
                `${ itemName }.json`
            ),
            cb
        )
    }

    return self
}
