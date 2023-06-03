import mongoose from 'mongoose'
import Errors   from 'http-errors'
import { IModel, IModelUpdate, Model, SchemaDefinition } from './mongo_base'
import { MESSAGES } from '../services/i18n/types'

// -----------------------------------------------------------------------------------
// ------------------------ 模型自定义方法 -----------------------
// -----------------------------------------------------------------------------------
declare module './mongo_base' {
  interface Model {
    // Add new methods to class ...
    greetings: (datamodelId: string) => Promise<string>
    findByVideo: (video: string) => Promise<IDatamodel>
  }
}

/** Get Model Mane */
Model.prototype.greetings = async function(datamodelId: string): Promise<string> {
  const sample: IDatamodel | null = await this.model.findById(datamodelId)
  console.log(sample)
  if(!sample) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return 'Hi ' + sample.name + '!!'
}

/** Find Model By Age */
Model.prototype.findByVideo = async function(video: string): Promise<IDatamodel> {
  const sample: IDatamodel | null = await this.model.findOne({ video })
  if(!sample) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return sample
}


// -----------------------------------------------------------------------------------
// ------------------------------ Your Sample Interface ------------------------------
// -----------------------------------------------------------------------------------
export interface IDatamodel extends IModel {
  name : string
  nameEn:string
  descript:string
  descriptEn:string
  parentId:string
  modelType:string
  storeType:string
  inherit:string
  tableName:string
  image:string
  video:string
}

export interface IDatamodelUpdate extends IModelUpdate {
  name? : IDatamodel['name']
  video?  : IDatamodel['video']
}


// -----------------------------------------------------------------------------------
// ---------------------- Your MongoDB Schema Model Definition -----------------------
// -----------------------------------------------------------------------------------
const definition: SchemaDefinition = {
  name: { type: mongoose.Schema.Types.String, required: true, unique: true },
  nameEn: { type: mongoose.Schema.Types.String, required: true, unique: true },
  descript: { type: mongoose.Schema.Types.String, required: true, unique: true },
  descriptEn: { type: mongoose.Schema.Types.String, required: true, unique: true },
  parentId: { type: mongoose.Schema.Types.String, required: true, unique: true },
  modelType: { type: mongoose.Schema.Types.String, required: true, unique: true },
  storeType: { type: mongoose.Schema.Types.String, required: true, unique: true },
  inherit: { type: mongoose.Schema.Types.String, required: true, unique: true },
  tableName: { type: mongoose.Schema.Types.String, required: true, unique: true },
  image: { type: mongoose.Schema.Types.String, required: true, unique: true },
  video:  { type: mongoose.Schema.Types.String, default: '' },
}

const baseModel: Model = new Model(definition)
baseModel.model = mongoose.model<IDatamodel>('datamodel', baseModel.schema)

export default baseModel


// -----------------------------------------------------------------------------------
// ---------------------------- Swagger Models Definition ----------------------------
// -----------------------------------------------------------------------------------

/**
 * @openapi
 * components:
 *   schemas:
 *     DataModel:
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
