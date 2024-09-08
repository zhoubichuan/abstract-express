import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/user'
import Validator from '../validators/user'
import { checkToken, checkRole } from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /user/create
// list:                GET       - /user/list
// details:             GET       - /user/:userId
// update:              PUT       - /user/:userId
// delete:              DELETE    - /user
// a secure action:     POST      - /user/:userId/secure-action
// login:               POST      - /user/login
// current:             GET      - /user/current

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /user/create:
 *     post:
 *       summary: 创建用户
 *       tags: [用户信息]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *                 - password
 *                 - access
 *                 - email
 *                 - phone
 *               properties:
 *                 username:
 *                   type: string
 *                   description: 用户名称
 *                 access:
 *                   type: boolean
 *                   description: 用户权限
 *                 password:
 *                   type: string
 *                   description: 用户密码
 *                 email:
 *                   type: string
 *                   description: 用户邮箱
 *                 phone:
 *                   type: string
 *                   description: 用户手机
 *               example:
 *                 username: 'admin'
 *                 access: true
 *                 email: 'zhoubichuan@icloud.com'
 *                 phone: '97232334145'
 *                 password: '123456'
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 */        
router.route('/create').post(Validator.create, Controller.create)

/**
 * @openapi
 * paths:
 *   /user/list:
 *     get:
 *       summary: 获取用户列表
 *       tags: [用户信息]
 *       responses:
 *         "200":
 *           description: Gets a list of user as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 user: object
 *                 properties:
 *                   success:
 *                     user: boolean
 *                     description: Response Status
 *                   result:
 *                     user: array
 *                     items:
 *                       user: object
 *                       properties:
 *                         total:
 *                           user: integer
 *                         list:
 *                           $ref: '#/components/schemas/User'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('/list').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /user/{userId}:
 *     get:
 *       summary: 获取用户详情
 *       tags: [用户信息]
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: 用户id
 *           required: true
 *           schema:
 *             user: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:userId').get(Controller.details)

/**
 * @openapi
 * paths:
 *   /user/{userId}:
 *     put:
 *       summary: 更新用户
 *       tags: [用户信息]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *                 - access
 *                 - email
 *                 - password
 *               properties:
 *                 username:
 *                   type: string
 *                 access:
 *                   type: boolean
 *                   description: User age
 *                 password:
 *                   type: string
 *                 email:
 *                   type: string
 *                   description: User age
 *               example:
 *                 username: 'Amin'
 *                 access: true
 *                 email: 'zhoubichuan@icloud.com'
 *                 password: '123456'
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             user: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:userId').put(Validator.update, Controller.update)
// router.route('/:userId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /user/{userId}:
 *     delete:
 *       summary: 删除用户
 *       tags: [用户信息]
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             user: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /user/{userId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [用户信息]
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: 用户id
 *           required: true
 *           schema:
 *             user: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:userId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)
/**
 * @openapi
 * paths:
 *   /user/login:
 *     post:
 *       summary: 用户登陆
 *       tags: [用户信息]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              required:
 *                - username
 *                - password
 *              properties:
 *                username:
 *                  type: string
 *                  description: 账户
 *                password:
 *                  type: string
 *                  description: 密码
 *              example:
 *                username: 'admin'
 *                password: '123456'
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('/login').post(Validator.login, Controller.login)
/**
 * @openapi
 * paths:
 *   /user/current:
 *     get:
 *       summary: 获取当前用户
 *       tags: [用户信息]
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('/current').get(Controller.current)

export default router
