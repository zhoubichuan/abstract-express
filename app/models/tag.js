var mongoose = require('mongoose')
var tagSchema = require('./../schemas/tag')

var Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag