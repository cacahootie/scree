'use strict'

exports.login = function login (req, res) {
    req.session.user = req.query.user
    res.end(req.session.user)
}
