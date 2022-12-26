import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/pay'
import Validator  from '../validators/pay'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /pay
// list:                GET       - /pay
// details:             GET       - /pay/:payId
// update:              PUT       - /pay/:payId
// delete:              DELETE    - /pay/:payId
// a secure action:     POST      - /pay/:payId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /pay/:
 *     post:
 *       summary: 创建付款
 *       tags: [付款操作]
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
 *   /pay/:
 *     get:
 *       summary: 获取付款列表
 *       tags: [付款操作]
 *       responses:
 *         "200":
 *           description: Gets a list of pay as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 pay: object
 *                 properties:
 *                   success:
 *                     pay: boolean
 *                     description: Response Status
 *                   result:
 *                     pay: array
 *                     items:
 *                       pay: object
 *                       properties:
 *                         total:
 *                           pay: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /pay/{payId}:
 *     get:
 *       summary: 获取付款详情
 *       tags: [付款操作]
 *       parameters:
 *         - name: payId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             pay: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:payId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /pay/{payId}:
 *     put:
 *       summary: 更新付款
 *       tags: [付款操作]
 *       parameters:
 *         - name: payId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             pay: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:payId').put(Validator.update, Controller.update)
// router.route('/:payId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /pay/{payId}:
 *     delete:
 *       summary: 删除付款
 *       tags: [付款操作]
 *       parameters:
 *         - name: payId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             pay: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:payId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /pay/{payId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [付款操作]
 *       parameters:
 *         - name: payId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             pay: string
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
router.route('/:payId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
