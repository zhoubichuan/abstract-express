import mongoose from 'mongoose'
import Errors from 'http-errors'
import { IModel, IModelUpdate, Model, SchemaDefinition } from './mongo_base'
import { MESSAGES } from '../services/i18n/types'

// -----------------------------------------------------------------------------------
// ------------------------ 模型自定义方法 -----------------------
// -----------------------------------------------------------------------------------
declare module './mongo_base' {
  interface Model {
    // Add new methods to class ...
    greetings: (dataentityId: string) => Promise<string>
    // findByVideo: (video: string) => Promise<IDataentity>
  }
}

/** Get Model Mane */
Model.prototype.greetings = async function (
  dataentityId: string
): Promise<string> {
  const sample: IDataentity | null = await this.model.findById(dataentityId)
  console.log(sample)
  if (!sample) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return 'Hi ' + sample.name + '!!'
}

/** Find Model By Age */
// Model.prototype.findByVideo = async function(video: string): Promise<IDataentity> {
//   const sample: IDataentity | null = await this.model.findOne({ video })
//   if(!sample) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
//   return sample
// }

// -----------------------------------------------------------------------------------
// ------------------------------ Your Sample Interface ------------------------------
// -----------------------------------------------------------------------------------
export interface IDataentity extends IModel {
  code?:string
  name: string
  nameEn: string
  descript: string
  descriptEn: string
  parentId: string
  modelType: string
  storeType: string
  inherit: string
  tableName: string
  // image:string
  // video:string
}

export interface IDataentityUpdate extends IModelUpdate {
  // name? : IDataentity['name']
  // video?  : IDataentity['video']
}

// -----------------------------------------------------------------------------------
// ---------------------- Your MongoDB Schema Model Definition -----------------------
// -----------------------------------------------------------------------------------
const definition: SchemaDefinition = {
  code: { type: mongoose.Schema.Types.String },
  name: { type: mongoose.Schema.Types.String, required: true },
  nameEn: { type: mongoose.Schema.Types.String, required: true },
  descript: { type: mongoose.Schema.Types.String, required: true },
  descriptEn: { type: mongoose.Schema.Types.String },
  parentId: { type: mongoose.Schema.Types.Boolean, required: true },
  modelType: { type: mongoose.Schema.Types.String, required: true },
  storeType: { type: mongoose.Schema.Types.Boolean, required: true },
  inherit: { type: mongoose.Schema.Types.Boolean, required: true },
  tableName: { type: mongoose.Schema.Types.String, required: true },
  // image: { type: mongoose.Schema.Types.String },
  // video:  { type: mongoose.Schema.Types.String},
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
baseModel.model = mongoose.model<IDataentity>('dataentity', baseModel.schema)

export default baseModel

// -----------------------------------------------------------------------------------
// ---------------------------- Swagger Models Definition ----------------------------
// -----------------------------------------------------------------------------------

/**
 * @openapi
 * components:
 *   schemas:
 *     DataEntity:
 *       type: object
 *       required:
 *         - name
 *         - nameEn
 *         - descript
 *         - descriptEn
 *         - parentId
 *         - modelType
 *         - storeType
 *         - inherit
 *         - tableName
 *       properties:
 *         name:
 *           type: string
 *           description: 中文名称
 *         nameEn:
 *           type: string
 *           description: 英文名称
 *         descript:
 *           type: string
 *           description: 中文描述
 *         descriptEn:
 *           type: string
 *           description: 英文描述
 *         parentId:
 *           type: boolean
 *           description: 父级id
 *         modelType:
 *           type: string
 *           description: 模型类型
 *         storeType:
 *           type: boolean
 *           description: 存储类型
 *         inherit:
 *           type: boolean
 *           description: 继承类型
 *         tableName:
 *           type: string
 *           description: 表名称
 *       example:
 *         name: '中文名称'
 *         nameEn: '英文名称'
 *         descript: '这里是内容的中文描述'
 *         descriptEn: '这里是内容的英文描述'
 *         parentId: true
 *         modelType: 'xdm'
 *         storeType: true
 *         inherit: false
 *         tableName: 'abc'
*     DataEntityList:
 *       type: object
 *       required:
 *         - current
 *         - pageSize
 *       properties:
 *         current:
 *           type: number
 *           description: 当前页面
 *         pageSize:
 *           type: number
 *           description: 分页大小
 *       example:
 *         current: 1
 *         pageSize: 20
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
 *           $ref: '#/components/schemas/DataEntity'
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
 *       description: 未认证
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */
