const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
// node.js 核心模块，提供了安全相关的功能，如加密，签名等
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    account: {
        unique: true,
        type: String
    },
    // username: String,
    password: String,
    pwdKey: String,
    info: {
        type: ObjectId,
        ref: 'Info'
    },
    role: {
        type: Number,
        default: 0
    },
    /* 
        0: normal 普通用户
        1: verify 邮件激活后的用户
        2: professonal 高级用户

        >10: admin 管理员
        >50: super admin 超级管理员(开发时候用)
    */
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    }
})

UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now()

        /**  crypto.randomBytes() 生成随机加密数据
         *   crypto.randomBytes(size, [callback])  生成加密用的伪随机码，支持2种方法，当传递cb的话就是异步方法，不传cb就是同步方法
         *   size参数是一个数字，指示要生成的字节数
         */
        crypto.randomBytes(16, (err, buf) => {
            let salt = buf.toString('hex')
            this.pwdKey = salt
            let iterations = 4096
            let keylen = 16
            let digest = 'sha1'
            /**  crypto.pbkdf2() 是一个用来导出密钥的函数，常用于生成加密的密码
             *   this.password  用来生成密钥的原文密码
             *   salt  一个加密用的值 
             *   iterations  迭代次数
             *   keylen 期望得到的密钥长度
             *   digest  一个伪随机函数
             */
            crypto.pbkdf2(this.password, salt, 4096, 16, 'sha1', (err, secret) => {
                this.password = secret.toString('hex')
                next()
            })
        })
    } else {
        this.updateAt = Date.now()
        next()
    }
})

UserSchema.methods.comparePwd = function (_password, cb) {
    console.log('_password   ' + _password)
    crypto.pbkdf2(_password, this.pwdKey, 4096, 16, 'sha1', (err, secret) => {
        if (err) return cb(err)
        if (secret.toString('hex') === this.password) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    })
}

module.exports = UserSchema