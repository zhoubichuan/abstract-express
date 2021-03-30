const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 获取ObjectId,populate需用到，用于表与表的关联
const ObjectId = Schema.Types.ObjectId

const clientSchema = new Schema({
    clientName: {
        unique: true,
        type: String
    },
    typeName: {
        type: ObjectId,
        ref: 'ClientType'
    },
    address:String,
    tel:String,
    fax:String,
    contactPerson:String,
    contactTel:String,
    payName:{
        type: ObjectId,
        ref:"Pay"
    },
    createdAt: {
        type: Date,
        defalut: Date.now()
    },
    updatedAt: {
        type: Date,
        defalut: Date.now()
    }
}) 

clientSchema.pre('save', function() {
    if (this.isNew) {
        this.createdAt = this.updatedAt = Date.now()
    } else {
        this.updatedAt = Date.now()
    }
    next()
})

module.exports = clientSchema