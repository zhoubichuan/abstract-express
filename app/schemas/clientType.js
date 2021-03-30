const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 获取ObjectId,populate需用到，用于表与表的关联
const ObjectId = Schema.Types.ObjectId

const clientTypeSchema = new Schema({
    clientType: {
        unique: true,
        type: String
    },
    clientTypeDes:String,
    createdAt: {
        type: Date,
        defalut: Date.now()
    },
    updatedAt: {
        type: Date,
        defalut: Date.now()
    }
}) 

clientTypeSchema.pre('save', function() {
    if (this.isNew) {
        this.createdAt = this.updatedAt = Date.now()
    } else {
        this.updatedAt = Date.now()
    }
    next()
})

module.exports = clientTypeSchema