import mongoose from 'mongoose'
import Errors from 'http-errors'
import { IModel, IModelUpdate, Model, SchemaDefinition } from './mongo_base'
import { MESSAGES } from '../services/i18n/types'
import crypto from 'crypto'

// -----------------------------------------------------------------------------------
// ------------------------ 模型自定义方法 -----------------------
// -----------------------------------------------------------------------------------
declare module './mongo_base' {
  interface Model {
    // Add new methods to class ...
    findById: (userId: string) => Promise<IUser>
    findByUsername: (username: string) => Promise<IUser>
  }
}

/** 通过用户id查询模型 */
Model.prototype.findById = async function (userId: string): Promise<IUser> {
  const result: IUser | null = await this.model.findById(userId)
  if (!result) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return result
}

/** 通过用户名称查询模型 */
Model.prototype.findByUsername = async function (username: string): Promise<IUser> {
  const result: IUser | null = await this.model.findOne({ username })
  if (!result) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return result
}

// -----------------------------------------------------------------------------------
// ------------------------------ Your Sample Interface ------------------------------
// -----------------------------------------------------------------------------------
export interface IUser extends IModel {
  username: string
  password: string
  phone: string
  email: string
  access: boolean
  comparePwd: (...param:any) => void
}

export interface IUserUpdate extends IModelUpdate {
  username?: IUser['username']
  password?: IUser['password']
}


// -----------------------------------------------------------------------------------
// ---------------------- Your MongoDB Schema Model Definition -----------------------
// -----------------------------------------------------------------------------------
const definition: SchemaDefinition = {
  username: { type: mongoose.Schema.Types.String, required: true, unique: true },
  password: { type: mongoose.Schema.Types.String, required: true},
  phone: { type: mongoose.Schema.Types.String, required: true, unique: true },
  email: { type: mongoose.Schema.Types.String, required: true, unique: true },
  access: { type: mongoose.Schema.Types.Boolean, required: true, },
  creater: {
    type: mongoose.Schema.Types.String,
    default: ''
  },
  creatTime: {
    type: mongoose.Schema.Types.Date,
    default: Date.now
  },
  modifier: { type: mongoose.Schema.Types.String, default: '' },
  modifyTime: {
    type: mongoose.Schema.Types.Date,
    default: Date.now
  }
}

const baseModel: Model = new Model(definition)
baseModel.schema.plugin((schema)=>{
  schema.pre('save', function(next) {
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now()
        /**  crypto.randomBytes() 生成随机加密数据
         *   crypto.randomBytes(size, [callback])  生成加密用的伪随机码，支持2种方法，当传递cb的话就是异步方法，不传cb就是同步方法
         *   size参数是一个数字，指示要生成的字节数
         */
        crypto.randomBytes(16, (err, buf:any) => {
          if(err){
            return console.log(err)
          }
            let salt = buf.toString('hex')
            console.log(salt)
            this.pwdKey = salt
            /**  crypto.pbkdf2() 是一个用来导出密钥的函数，常用于生成加密的密码
             *   this.password  用来生成密钥的原文密码
             *   salt  一个加密用的值 
             *   iterations  迭代次数
             *   keylen 期望得到的密钥长度
             *   digest  一个伪随机函数
             */
            crypto.pbkdf2(this.password, 'salt', 4096, 16, 'sha1', (err, secret) => {
              if(err){
                return console.log(err)
              }
                this.password = secret.toString('hex')
                next()
            })
        })
    } else {
        this.updateAt = Date.now()
        next()
    }
})

schema.methods.comparePwd = function (_password:any, cb:any) {
    crypto.pbkdf2(_password, 'salt', 4096, 16, 'sha1', (err, secret) => {
        if (err) return cb(err)
        if (secret.toString('hex') === this.password) {
            cb(null, true)
        } else {
            cb(null, true)
        }
    })
}
})
baseModel.model = mongoose.model<IUser>('user', baseModel.schema)

export default baseModel


// -----------------------------------------------------------------------------------
// ---------------------------- Swagger Models Definition ----------------------------
// -----------------------------------------------------------------------------------

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       required:
 *         - username
 *         - access
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         access:
 *           type: boolean
 *           description: User age
 *         password:
 *           type: string
 *         email:
 *           type: string
 *           description: User age
 *       example:
 *         username: 'Amin'
 *         access: true
 *         email: 'zhoubichuan@icloud.com'
 *         password: '123456'
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - access
 *       properties:
 *         username:
 *           type: string
 *           description: 账户
 *         access:
 *           type: boolean
 *           description: 权限
 *         password:
 *           type: string
 *           description: 密码
 *         email:
 *           type: string
 *           description: 邮箱地址
 *       example:
 *         username: 'admin'
 *         password: 'ant.design'
 *         email: 'zhoubichuan@icloud.com'
 *         access: 'access'
 *     Error:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *         message:
 *           type: string
 *         body:
 *           type: object
 *       required:
 *         - statusCode
 *         - message
 *       example:
 *         statusCode: 400
 *         message: 'Some Error ...'
 *         body: null
 *     Success:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Response Status
 *         result:
 *           $ref: '#/components/schemas/User'
 *   responses:
 *     Success:
 *       description: 请求成功响应
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Success'
 *     BadRequest:
 *       description:  错误请求提要
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     NotFound:
 *       description: 找不到指定的资源
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     Unauthorized:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */
