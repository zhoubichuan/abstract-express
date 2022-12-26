import Joi    from 'joi'
import config from '../configs'
import { validate } from '../middlewares/validator'

const objectId = Joi.string().regex(config.regex.objectId)

const exportResult = {

  // Create new Sample
  create: validate({
    body: Joi.object({
      name: Joi.string().required().description('User Name'),
      age: Joi.number().min(1).description('User Age'),
    }),
    query: Joi.object({})
  }),

  // List All Samples
  list: validate({
    query: Joi.object({
      pageSize: Joi.number().default(10).description('分页大小'),
      current: Joi.number().default(1).description('当前页'),
      // name: Joi.string().max(50).description('Sample Name'),
      // userId: Joi.string().max(50).description('User ID'),
      // dateRange: Joi.object({
      //   from: Joi.date().description('Date Range From'),
      //   to:   Joi.date().description('Date Range To'),
      // }).or('from', 'to').description('Date Range'),
      sorter: Joi.string().valid(...Object.keys(config.sortTypes)).description('排序'),
    })
  }),

  // Show Sample Details
  details: validate({
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // Update Sample
  update: validate({
    // body: Joi.object({
    //   name: Joi.string().description('User Name'),
    //   userId: objectId.required().description('User ID')
    // }),
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // Delete Sample (Soft Delete)
  delete: validate({
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // Secure Action
  secureAction: validate({
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

}

export default exportResult