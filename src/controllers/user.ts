/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import Errors from 'http-errors'
import { MESSAGES } from '../services/i18n/types'
import { create as createToken } from '../services/jwt'
import User, { IUser } from '../models/mongo_user'
import { IQueryData } from '../models/mongo_base'
import { decode } from '../services/jwt'

const exportResult = {

  // 创建
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IUser = req.body
      const result = await User.add(data)

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
      const result = await User.list(query)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // 查询详情
  async details(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.userId
      // const result = await Sample.details(userId)

      // Get your custom method
      const result = await User.findById(userId)

      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // 更新
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.userId
      const result = await User.updateById(userId, req.body)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // 软删除
  async archive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.userId
      const result = await User.softDelete(userId)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // 删除
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userIds: string[]= req.body
      if (userIds.length === 1) {
        res.result = await User.remove(userIds[0])
      } else {
        res.result = await User.removePatch(userIds)
      }
      next(res)
    }
    catch (err) { next(err) }
  },

  // 安全认证
  async secureAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check Sample in Auth Header
      if (req.user.role !== 'admin') throw new Errors.Unauthorized(MESSAGES.UNAUTHORIZED)

      const userId: string = req.params.userId
      const result = await User.details(userId)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // 登陆
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IUser = req.body
      const result = await User.findByUsername(data.username)

      // ---- Use Socket.io
      // const io: SocketIO.Server = req.app.get('io')
      // io.emit('someEvent', { someData: '...' })
      result.comparePwd(data.password, (err: any, isMatch: boolean) => {
        if (err) throw err
        if (isMatch == true) {
          let token = createToken({ usename: result.username })
          res.result = { ...(result as any)._doc, token }
        } else {
          res.result = (result as any)._doc
        }
        next(res)
      })
    } catch (err) { next(err) }
  },

  // 当前用户
  async current(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token: any = req.headers.authorization?.split(' ')[1]
      const user = decode(token)
      res.result = {}
      if (user) {
        res.result = user
      }

      next(res)
    } catch (err) { next(err) }
  },
}

export default exportResult