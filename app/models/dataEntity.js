var mongoose = require('mongoose')
var dataEntitySchema = require('./../schemas/dataEntity')

var dataEntity = mongoose.model('dataEntity', dataEntitySchema)

module.exports = dataEntity