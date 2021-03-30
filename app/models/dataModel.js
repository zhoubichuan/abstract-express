var mongoose = require('mongoose')
var DataModelSchema = require('./../schemas/dataModel')

var dataModel = mongoose.model('datamodel', DataModelSchema)

module.exports = dataModel