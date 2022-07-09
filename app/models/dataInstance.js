var mongoose = require('mongoose')
var dataInstanceSchema = require('./../schemas/dataInstance')

var dataInstance = mongoose.model('dataInstance', dataInstanceSchema)

module.exports = dataInstance