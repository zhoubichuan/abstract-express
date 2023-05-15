import mongoose, { Schema, Document } from 'mongoose'
import Errors from 'http-errors'
import uniqueV from 'mongoose-unique-validator'
import config from '../configs'
import { mergeDeep } from '../services/methods'
import { MESSAGES } from '../services/i18n/types'

// Typescript Base Model
export interface IModel extends Document {
  createdAt?: number
  updatedAt?: number
  deletedAt?: number
}

export interface IModelUpdate extends Document {
  updatedAt?: IModel['updatedAt']
}

export type SchemaDefinition =
  | {
      [path: string]: mongoose.SchemaDefinitionProperty<undefined>
    }
  | {
      [x: string]: mongoose.SchemaDefinitionProperty<any> | undefined
    }
  | undefined
const baseDefinition: SchemaDefinition = {
  createdAt: { type: Schema.Types.Number },
  updatedAt: { type: Schema.Types.Number },
  deletedAt: { type: Schema.Types.Number, default: 0 }
}

export type SchemaOptions = mongoose.SchemaOptions | undefined
const baseOptions: SchemaOptions = {
  strict: false // To allow database in order to save Mixed type data in DB
}

export interface IQueryData {
  current: number
  pageSize: number
  sortType?: string
  deletedAt: number // Always filter deleted documents
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // needs to specified later based on entity or model
}

export interface ISort {
  [key: string]: mongoose.SortOrder
}

export class Model {
  public schema: mongoose.Schema
  public model: mongoose.Model<any>

  constructor(
    public definition: SchemaDefinition,
    public options?: SchemaOptions
  ) {
    // super()
    this.definition = { ...this.definition, ...baseDefinition }
    this.options = this.options
      ? { ...this.options, ...baseOptions }
      : baseOptions
    this.schema = new Schema(definition, options)
    this.schema.plugin(uniqueV)
  }

  async add(data: Document): Promise<Document> {
    const modelData = { ...data, createdAt: Date.now() }
    return await this.model.create(modelData)
  }

  async list(queryData: IQueryData): Promise<{ page: object; data: IModel[] }> {
    const { current, pageSize, sorter, filter, ...query } = queryData
    const setSize: number = pageSize
    // > config.maxPageSizeLimit ? config.maxPageSizeLimit : pageSize
    const sortBy: ISort =
      sorter && sorter !== config.sortTypes.date
        ? { [config.sortTypes[sorter]]: 1 }
        : { createdAt: -1 }

    // if(query.dateRange) {
    //   query.createdAt = {}
    //   if(query.dateRange.from) query.createdAt['$gte'] = query.dateRange.from
    //   if(query.dateRange.to)   query.createdAt['$lte'] = query.dateRange.to
    //   delete query.dateRange
    // }
    // if(query.name) query.name = { '$regex': query.name, '$options': 'i' }

    query.deletedAt = 0

    const total: number = await this.model.countDocuments(query)
    const result: IModel[] = await this.model
      .find(query)
      .limit(setSize)
      .skip((current - 1) * setSize)
      .sort(sortBy)
    return {
      page: { total, current, pageSize },
      data: result
    }
  }

  async details(modelId: string): Promise<IModel> {
    const model: IModel | null = await this.model.findById(modelId)
    if (!model) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    return model
  }
  async detailsPatch(modelIds: string[]): Promise<IModel> {
    const models: any | null = await this.model.find(modelIds)
    if (!models) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    return models
  }
  async updateByQuery(query: IQueryData, data: IModelUpdate): Promise<IModel> {
    const updatedData = { ...data, updatedAt: Date.now() }
    return (await this.model.findOneAndUpdate(query, updatedData, {
      new: true
    })) as IModel
  }

  async updateById(modelId: string, data: IModelUpdate): Promise<IModel> {
    const model: IModel = await this.details(modelId)
    model.updatedAt = Date.now()
    const updatedModelName: IModel = mergeDeep(model, data) as IModel
    return (await this.model.findByIdAndUpdate(modelId, updatedModelName, {
      new: true
    })) as IModel
  }

  async softDelete(modelId: string): Promise<IModel> {
    const model: IModel = await this.details(modelId)
    return (await this.model.findByIdAndUpdate(
      model.id,
      { deletedAt: Date.now() },
      { new: true }
    )) as IModel
  }

  async remove(
    modelId: string
  ): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const model: IModel = await this.details(modelId)
    return await this.model.deleteOne({ _id: model.id })
  }
  async removePatch(
    modelIds: string[]
  ): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const model: IModel = await this.detailsPatch(modelIds)
    return await this.model.remove({ _id: model.id })
  }
  async restore(modelId: string): Promise<IModel> {
    const model: IModel = await this.details(modelId)
    return (await this.model.findByIdAndUpdate(
      model.id,
      { deletedAt: 0 },
      { new: true }
    )) as IModel
  }

  async getNextSequenceValue() {
    return await this.model.findOneAndUpdate(
      { $inc: { code: 1 } },
      { new: true }
    )
  }
}
