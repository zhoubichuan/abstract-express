import Joi    from 'joi'
import config from '../configs'
import { validate } from '../middlewares/validator'

const objectId = Joi.string().regex(config.regex.objectId)

const exportResult = {

  // 创建字段
  create: validate({
    body: Joi.object({
      name: Joi.string().required().description('中文名称'),
      nameEn: Joi.string().required().description('英文名称'),
      descript: Joi.string().required().description('中文描述'),
      descriptEn: Joi.string().required().description('英文描述'),
      parentId: Joi.string().required().description('父级id'), modelType: Joi.string().required().description('模型类型'),
      storeType: Joi.string().required().description('存储类型'),
      inherit: Joi.string().required().description('继承类型'),
      tableName: Joi.string().required().description('表名称'),
      image: Joi.string().required().description('图片'),
      video: Joi.string().description('视频'),
    }),
    query: Joi.object({})
  }),

  // 列表字段
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

  // 详情字段
  details: validate({
    params: Joi.object({
      attributeId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // 更新字段
  update: validate({
    // body: Joi.object({
    //   name: Joi.string().description('User Name'),
    //   userId: objectId.required().description('User ID')
    // }),
    params: Joi.object({
      attributeId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // 软删除字段
  delete: validate({
    params: Joi.object({
      attributeId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // 安全验证
  secureAction: validate({
    params: Joi.object({
      attributeId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

}

export default exportResult