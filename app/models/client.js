var mongoose = require('mongoose')
var clientSchema = require('./../schemas/client')

var Client = mongoose.model('Client', clientSchema)

module.exports = Client