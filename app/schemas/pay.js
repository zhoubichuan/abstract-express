const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
// node.js 核心模块，提供了安全相关的功能，如加密，签名等
const crypto = require('crypto')

const PaySchema = new mongoose.Schema({
    paymentAccount:{
        unique: true,
        type: String
    },
    paymentName:String,
    createdAt: {
        type: Date,
        defalut: Date.now()
    },
    updatedAt: {
        type: Date,
        defalut: Date.now()
    }
});

PaySchema.pre('save', function() {
    if (this.isNew) {
        this.createdAt = this.updatedAt = Date.now()
    } else {
        this.updatedAt = Date.now()
    }
    next()
})

module.exports = PaySchema