import Joi from 'joi'
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
      descriptEn: Joi.string().description('英文描述'),
      parentId: Joi.boolean().required().description('父级id'),
      modelType: Joi.string().required().description('模型类型'),
      storeType: Joi.boolean().required().description('存储类型'),
      inherit: Joi.boolean().required().description('继承类型'),
      tableName: Joi.string().required().description('表名称'),
      // image: Joi.string().description('图片'),
      // video: Joi.string().description('视频'),
    }),
  }),

  // 列表字段
  list: validate({
    query: Joi.object({
      pageSize: Joi.number().default(10).description('分页大小'),
      current: Joi.number().default(1).description('当前页'),
      sorter: Joi.string().valid(...Object.keys(config.sortTypes)).description('排序'),
    })
  }),

  // 详情字段
  details: validate({
    params: Joi.object({
      id: objectId.required().description('数据实体id')
    }),
  }),

  // 更新字段
  update: validate({
    params: Joi.object({
      id: objectId.required().description('id字段')
    }),
    body: Joi.object({
      name: Joi.string().required().description('中文名称'),
      nameEn: Joi.string().required().description('英文名称'),
      descript: Joi.string().required().description('中文描述'),
      descriptEn: Joi.string().description('英文描述'),
      parentId: Joi.boolean().required().description('父级id'),
      modelType: Joi.string().required().description('模型类型'),
      storeType: Joi.boolean().required().description('存储类型'),
      inherit: Joi.boolean().required().description('继承类型'),
      tableName: Joi.string().required().description('表名称'),
      // image: Joi.string().description('图片'),
      // video: Joi.string().description('视频'),
    }),
  }),

  // 单个删除
  delete: validate({

  }),

  // 批量删除
  pathdelete: validate({
    body: Joi.array()
  }),

  // 安全验证
  secureAction: validate({
    params: Joi.object({
      attributeId: objectId.required().description('Sample ID')
    }),
  }),

}

export default exportResult