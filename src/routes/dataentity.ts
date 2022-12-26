import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/dataentity'
import Validator  from '../validators/dataentity'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /dataentity
// list:                GET       - /dataentity
// details:             GET       - /dataentity/:dataentityId
// update:              PUT       - /dataentity/:dataentityId
// delete:              DELETE    - /dataentity/:dataentityId
// a secure action:     POST      - /dataentity/:dataentityId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /dataentity/:
 *     post:
 *       summary: 创建实体
 *       tags: [数据实体]
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
 *   /dataentity/:
 *     get:
 *       summary: 获取实体列表
 *       tags: [数据实体]
 *       responses:
 *         "200":
 *           description: Gets a list of dataentity as an array of objects
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
 *   /dataentity/{dataentityId}:
 *     get:
 *       summary: 获取实体详情
 *       tags: [数据实体]
 *       parameters:
 *         - name: dataentityId
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
router.route('/:dataentityId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /dataentity/{dataentityId}:
 *     put:
 *       summary: 更新实体
 *       tags: [数据实体]
 *       parameters:
 *         - name: dataentityId
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
router.route('/:dataentityId').put(Validator.update, Controller.update)
// router.route('/:dataentityId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /dataentity/{dataentityId}:
 *     delete:
 *       summary: 删除实体
 *       tags: [数据实体]
 *       parameters:
 *         - name: dataentityId
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
router.route('/:dataentityId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /dataentity/{dataentityId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [数据实体]
 *       parameters:
 *         - name: dataentityId
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
router.route('/:dataentityId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
