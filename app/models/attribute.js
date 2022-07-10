var mongoose = require('mongoose')
var attributeSchema = require('./../schemas/attribute')

var attribute = mongoose.model('attribute', attributeSchema)

module.exports = attribute