/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import Errors from 'http-errors'
import { MESSAGES } from '../services/i18n/types'

import Dataentity, { IDataentity } from '../models/mongo_dataentity'
import { IQueryData } from '../models/mongo_base'

const exportResult = {
  // 创建
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IDataentity = req.body
      const currentId = await Dataentity.getId()
      data.code = currentId
      const result = await Dataentity.add(data)

      // ---- Use Socket.io
      // const io: SocketIO.Server = req.app.get('io')
      // io.emit('someEvent', { someData: '...' })

      res.result = (result as any)._doc
      next(res)
    } catch (err) {
      next(err)
    }
  },

  // 列表查询
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body: IQueryData = req.body as IQueryData
      const result = await Dataentity.list(body)
      res.result = result
      next(res)
    } catch (err) {
      next(err)
    }
  },

  // 查询详情
  async details(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id: string = req.params.id
      const result = await Dataentity.greetings(id)
      res.result = (result as any)._doc
      next(res)
    } catch (err) {
      next(err)
    }
  },

  // 更新
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id
      const result = await Dataentity.updateById(id, req.body)
      res.result = (result as any)._doc
      next(res)
    } catch (err) {
      next(err)
    }
  },

  // 软删除
  async archive(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id: string = req.params.id
      const result = await Dataentity.softDelete(id)
      res.result = (result as any)._doc
      next(res)
    } catch (err) {
      next(err)
    }
  },

  // 删除
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id
      const result = await Dataentity.remove(id)
      res.result = result
      next(res)
    } catch (err) {
      next(err)
    }
  },
  // 批量删除
  async pathdelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ids: string[] = req.body
      const result = await Dataentity.removePatch(ids)
      res.result = result
      next(res)
    } catch (err) {
      next(err)
    }
  },
  // 安全认证
  async secureAction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check Sample in Auth Header
      if (req.user.role !== 'admin')
        throw new Errors.Unauthorized(MESSAGES.UNAUTHORIZED)

      const dataentityId: string = req.params.dataentityId
      const result = await Dataentity.details(dataentityId)
      res.result = (result as any)._doc
      next(res)
    } catch (err) {
      next(err)
    }
  }
}

export default exportResult
