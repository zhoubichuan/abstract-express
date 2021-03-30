var mongoose = require('mongoose')
var orderSchema = require('./../schemas/order')

var Order = mongoose.model('Order', orderSchema)

module.exports = Order