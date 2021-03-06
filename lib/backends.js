'use strict'

const fs = require('fs'),
      path = require('path')

const mkdirp = require('mkdirp'),
      jsonfile = require('jsonfile'),
      parallel = require('run-parallel'),
      isSubset = require('is-subset')


exports.fileBackend = function fileBackend (app) {
    const self = {},
          schemataPath = path.join(app.locals.env.static_path, 'schemata')

    self.filterItems = function filterItems (schemaName, match, finalCallback) {
        function matchItem(item, cb) {
            if (isSubset(item, match)) cb(null, item)
            else cb(null, null)
        }

        self.listItems(schemaName, (e, items) => {
            const funcs = []
            for (let f of items) {
                funcs.push(cb => {
                    self.getItem(schemaName, f, (e, d) => {
                        matchItem(d, cb)
                    })
                })
            }
            parallel(funcs, (e, d) => {
                const filtered = []
                for (let i of d) if (i) filtered.push(i)
                finalCallback(e, filtered)
            })
        })
    }

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

    self.getSchema = function getSchema (schemaName) {
        if (!schemaName.endsWith('.json')) schemaName += '.json'
        return jsonfile.readFileSync(path.join(schemataPath, schemaName))
    }

    self.saveItem = function saveItem (schemaName, itemName, item, cb) {
        const saveDir = path.join(app.locals.env.static_path, 'items', schemaName)
        mkdirp(saveDir, err => {
            if (err) return console.error(err)
            jsonfile.writeFile(path.join(saveDir, `${ itemName }.json`), item, cb)
        })
    }

    self.getItem = function getItem (schemaName, itemName, cb) {
        const fpath = path.join(
            app.locals.env.static_path, 'items', schemaName, `${ itemName}.json`
        )
        jsonfile.readFile(fpath, (e,d) => {
            if (e) {
                //console.error(e)
                return cb(e, null)
            } else {
                return cb(null, d)
            }
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
