var mongoose = require('mongoose')
var clientTypeSchema = require('./../schemas/clientType')

var ClientType = mongoose.model('ClientType', clientTypeSchema)

module.exports = ClientType