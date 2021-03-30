var mongoose = require('mongoose')
var orderTypeSchema = require('../schemas/orderType')

var OrderType = mongoose.model('OrderType', orderTypeSchema)

module.exports = OrderType