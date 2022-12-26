/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import Errors from 'http-errors'
import { MESSAGES } from '../services/i18n/types'

import Tags, { ITags } from '../models/mongo_tags'
import { IQueryData } from '../models/mongo_base'

const exportResult = {

  // 创建
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: ITags = req.body
      const result = await Tags.add(data)

      // ---- Use Socket.io
      // const io: SocketIO.Server = req.app.get('io')
      // io.emit('someEvent', { someData: '...' })

      res.result = (result as any)._doc
      next(res)
    } catch (err) { next(err) }
  },

  // 列表查询
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: IQueryData = req.query as IQueryData
      const result = await Tags.list(query)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // 查询详情
  async details(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tagsId: string = req.params.tagsId
      // const result = await Sample.details(tagsId)

      // Get your custom method
      const result = await Tags.greetings(tagsId)

      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // 更新
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tagsId: string = req.params.tagsId
      const result = await Tags.updateById(tagsId, req.body)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // 软删除
  async archive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tagsId: string = req.params.tagsId
      const result = await Tags.softDelete(tagsId)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // 删除
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tagsId: string = req.params.tagsId
      const result = await Tags.remove(tagsId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // 安全认证
  async secureAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check Sample in Auth Header
      if (req.user.role !== 'admin') throw new Errors.Unauthorized(MESSAGES.UNAUTHORIZED)

      const tagsId: string = req.params.tagsId
      const result = await Tags.details(tagsId)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

}

export default exportResult