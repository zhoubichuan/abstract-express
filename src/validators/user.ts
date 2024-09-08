import Joi from 'joi'
import config from '../configs'
import { validate } from '../middlewares/validator'

const objectId = Joi.string().regex(config.regex.objectId)

const exportResult = {

  // 创建字段
  create: validate({
    body: Joi.object({
      username: Joi.string().required().description('用户名称'),
      access: Joi.boolean().required().description('权限'),
      email: Joi.string().required().description('邮箱'),
      phone: Joi.string().required().description('手机号'),
      password: Joi.string().required().description('密码'),
    }),
  }),

  // 列表字段
  list: validate({
    query: Joi.object({
      pageSize: Joi.number().default(10).description('分页大小'),
      current: Joi.number().default(1).description('当前页'),
      sorter: Joi.object().default({}).description('排序'),
      filter: Joi.object().default({}).description('筛选'),
      username: Joi.string().description('用户名称'),
    })
  }),

  // 更新字段
  update: validate({
    body: Joi.object({
      username: Joi.string().required().description('用户名称'),
      access: Joi.string().description('权限'),
      email: Joi.string().required().description('邮箱'),
      phone: Joi.string().required().description('手机号'),
      password: Joi.string().required().description('密码'),
    }),
  }),

  // 软删除字段
  delete: validate({
    params: Joi.object({
      id: objectId.required().description('用户id')
    }),
  }),
  // 软删除字段
  patchDelete: validate({
    body: Joi.object({
      id: Joi.array().required().description('用户id列表')
    }),
  }),

  // 安全验证
  secureAction: validate({
    params: Joi.object({
      attributeId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // 登陆字段
  login: validate({
    body: Joi.object({
      username: Joi.string().description('用户名称'),
      password: Joi.string().description('用户密码'),
    }),
    query: Joi.object({})
  }),

  // 详情字段
  current: validate({
    params: Joi.object({}),
    query: Joi.object({})
  }),
}

export default exportResult