var mongoose = require('mongoose')
var relationEntitySchema = require('./../schemas/relationEntity')

var relationEntity = mongoose.model('relationEntity', relationEntitySchema)

module.exports = relationEntity