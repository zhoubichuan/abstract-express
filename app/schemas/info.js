const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const InfoSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'users'
    },
    username: {
        type: String,
        default: '临时用户名'
    },
    avatar: String,
    job: String,
    address: String,
    tel: String,
    email: String,
    craetedAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

/**
 * Schema.pre() pre() 是个中间件，一旦使用中间件，就会全部中间件执行完才会执行其它操作
 * 
 * pre() 属于前置中间件，如果当前方法执行错误，将不会执行下面的方法
 * 串行中间件是一个接一个的执行，只有前一个中间件里调用next()函数，后一个中间件才会执行。
 */
InfoSchema.pre('save', function () {
    if (this.isNew) {
        this.craetedAt = this.updatedAt = Date.now()
    } else {
        this.updatedAt = Date.now()
    }
})

module.exports = InfoSchema