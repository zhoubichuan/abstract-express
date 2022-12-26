import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/order'
import Validator  from '../validators/order'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /order
// list:                GET       - /order
// details:             GET       - /order/:orderId
// update:              PUT       - /order/:orderId
// delete:              DELETE    - /order/:orderId
// a secure action:     POST      - /order/:orderId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /order/:
 *     post:
 *       summary: 创建订单
 *       tags: [订单操作]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sample'
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').post(Validator.create, Controller.create)

/**
 * @openapi
 * paths:
 *   /order/:
 *     get:
 *       summary: 获取订单列表
 *       tags: [订单操作]
 *       responses:
 *         "200":
 *           description: Gets a list of order as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 order: object
 *                 properties:
 *                   success:
 *                     order: boolean
 *                     description: Response Status
 *                   result:
 *                     order: array
 *                     items:
 *                       order: object
 *                       properties:
 *                         total:
 *                           order: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /order/{orderId}:
 *     get:
 *       summary: 获取订单详情
 *       tags: [订单操作]
 *       parameters:
 *         - name: orderId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             order: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:orderId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /order/{orderId}:
 *     put:
 *       summary: 更新订单
 *       tags: [订单操作]
 *       parameters:
 *         - name: orderId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             order: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:orderId').put(Validator.update, Controller.update)
// router.route('/:orderId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /order/{orderId}:
 *     delete:
 *       summary: 删除订单
 *       tags: [订单操作]
 *       parameters:
 *         - name: orderId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             order: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:orderId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /order/{orderId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [订单操作]
 *       parameters:
 *         - name: orderId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             order: string
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
router.route('/:orderId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
