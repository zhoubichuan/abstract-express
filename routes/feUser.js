var express = require('express')
var router = express.Router()
var User = require('../app/models/user.js')
var { handleError } = require('./../public/util/handleError')

router.get('/author', (req, res, next) => {
    User
        .findOne({account: 'gjw'})
        .populate('info')
        .exec()
        .then(user => {
            res.json({
                status: 200,
                msg: '',
                result: user
            })
        })
})

module.exports = router