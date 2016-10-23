'use strict'

const path = require('path')

exports.get_env = function (save_dir, NODE_ENV) {
    const cfg = {
        NOCACHE: process.env.NOCACHE,
        static_base: process.env.STATIC_BASE || 'http://rawgit.com',
        version: require("../package.json").version,
        PORT: process.env.PORT || 8000,
        NODE_ENV: process.env.NODE_ENV || NODE_ENV || 'development',
        save_dir: process.env.SAVE_DIR || save_dir || '.'
    }
    cfg.static_path = path.join(cfg.save_dir, 'static', 'pub')
    return cfg
}
