import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/product'
import Validator  from '../validators/product'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /product
// list:                GET       - /product
// details:             GET       - /product/:productId
// update:              PUT       - /product/:productId
// delete:              DELETE    - /product/:productId
// a secure action:     POST      - /product/:productId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /product/:
 *     post:
 *       summary: 创建产品
 *       tags: [产品操作]
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
 *   /product/:
 *     get:
 *       summary: 获取产品列表
 *       tags: [产品操作]
 *       responses:
 *         "200":
 *           description: Gets a list of product as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 product: object
 *                 properties:
 *                   success:
 *                     product: boolean
 *                     description: Response Status
 *                   result:
 *                     product: array
 *                     items:
 *                       product: object
 *                       properties:
 *                         total:
 *                           product: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /product/{productId}:
 *     get:
 *       summary: 获取产品详情
 *       tags: [产品操作]
 *       parameters:
 *         - name: productId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             product: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:productId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /product/{productId}:
 *     put:
 *       summary: 更新产品
 *       tags: [产品操作]
 *       parameters:
 *         - name: productId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             product: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:productId').put(Validator.update, Controller.update)
// router.route('/:productId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /product/{productId}:
 *     delete:
 *       summary: 删除产品
 *       tags: [产品操作]
 *       parameters:
 *         - name: productId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             product: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:productId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /product/{productId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [产品操作]
 *       parameters:
 *         - name: productId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             product: string
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
router.route('/:productId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
