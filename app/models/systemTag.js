var mongoose = require('mongoose')
var systemTagSchema = require('./../schemas/systemTag')

var systemTag = mongoose.model('systemTag', systemTagSchema)

module.exports = systemTag