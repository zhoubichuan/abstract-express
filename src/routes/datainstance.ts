import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/datainstance'
import Validator  from '../validators/datainstance'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /datainstance
// list:                GET       - /datainstance
// details:             GET       - /datainstance/:datainstanceId
// update:              PUT       - /datainstance/:datainstanceId
// delete:              DELETE    - /datainstance/:datainstanceId
// a secure action:     POST      - /datainstance/:datainstanceId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /datainstance/:
 *     post:
 *       summary: 创建实例
 *       tags: [数据实例]
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
 *   /datainstance/:
 *     get:
 *       summary: 获取实例列表
 *       tags: [数据实例]
 *       responses:
 *         "200":
 *           description: Gets a list of datainstance as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     description: Response Status
 *                   result:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /datainstance/{datainstanceId}:
 *     get:
 *       summary: 获取实例详情
 *       tags: [数据实例]
 *       parameters:
 *         - name: datainstanceId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:datainstanceId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /datainstance/{datainstanceId}:
 *     put:
 *       summary: 更新实例
 *       tags: [数据实例]
 *       parameters:
 *         - name: datainstanceId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:datainstanceId').put(Validator.update, Controller.update)
// router.route('/:datainstanceId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /datainstance/{datainstanceId}:
 *     delete:
 *       summary: 删除实例
 *       tags: [数据实例]
 *       parameters:
 *         - name: datainstanceId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:datainstanceId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /datainstance/{datainstanceId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [数据实例]
 *       parameters:
 *         - name: datainstanceId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             type: string
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
router.route('/:datainstanceId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
