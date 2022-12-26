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
    greetings: (orderId: string) => Promise<string>
    findByVideo: (video: string) => Promise<IOrder>
  }
}

/** Get Model Mane */
Model.prototype.greetings = async function(orderId: string): Promise<string> {
  const sample: IOrder | null = await this.model.findById(orderId)
  console.log(sample)
  if(!sample) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return 'Hi ' + sample.name + '!!'
}

/** Find Model By Age */
Model.prototype.findByVideo = async function(video: string): Promise<IOrder> {
  const sample: IOrder | null = await this.model.findOne({ video })
  if(!sample) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return sample
}


// -----------------------------------------------------------------------------------
// ------------------------------ Your Sample Interface ------------------------------
// -----------------------------------------------------------------------------------
export interface IOrder extends IModel {
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

export interface IOrderUpdate extends IModelUpdate {
  name? : IOrder['name']
  video?  : IOrder['video']
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
baseModel.model = mongoose.model<IOrder>('order', baseModel.schema)

export default baseModel


// -----------------------------------------------------------------------------------
// ---------------------------- Swagger Models Definition ----------------------------
// -----------------------------------------------------------------------------------

/**
 * @openapi
 * components:
 *   schemas:
 *     Sample:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *           description: User age
 *       example:
 *         name: 'Amin'
 *         age: 34
 */
