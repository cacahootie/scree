'use strict'

const _ = require('lodash')

exports.get_env = function (save_dir, NODE_ENV) {
    const cfg = {
        NOCACHE: process.env.NOCACHE,
        static_base: process.env.STATIC_BASE || 'http://rawgit.com',
        version: require("../package.json").version,
        PORT: process.env.PORT || 8000,
        NODE_ENV: process.env.NODE_ENV || NODE_ENV || 'development',
        save_dir: process.env.SAVE_DIR || save_dir || '.'
    }
    if (process.env.GH_REPO || process.env.MODE === 'github') {
        _.extend(cfg, {
            github: true,
            local: false
        })
    } else {
        _.extend(cfg, {
            local: true,
            NOCACHE: true,
        })
    }
    return cfg
}
