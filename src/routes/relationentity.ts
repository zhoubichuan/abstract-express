import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/relationentity'
import Validator  from '../validators/relationentity'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /relationentity
// list:                GET       - /relationentity
// details:             GET       - /relationentity/:relationentityId
// update:              PUT       - /relationentity/:relationentityId
// delete:              DELETE    - /relationentity/:relationentityId
// a secure action:     POST      - /relationentity/:relationentityId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /relationentity/:
 *     post:
 *       summary: 创建关系实体
 *       tags: [关系实体]
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
 *   /relationentity/:
 *     get:
 *       summary: 获取关系实体列表
 *       tags: [关系实体]
 *       responses:
 *         "200":
 *           description: Gets a list of relationentity as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 relationentity: object
 *                 properties:
 *                   success:
 *                     relationentity: boolean
 *                     description: Response Status
 *                   result:
 *                     relationentity: array
 *                     items:
 *                       relationentity: object
 *                       properties:
 *                         total:
 *                           relationentity: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /relationentity/{relationentityId}:
 *     get:
 *       summary: 获取关系实体详情
 *       tags: [关系实体]
 *       parameters:
 *         - name: relationentityId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             relationentity: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:relationentityId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /relationentity/{relationentityId}:
 *     put:
 *       summary: 更新关系实体
 *       tags: [关系实体]
 *       parameters:
 *         - name: relationentityId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             relationentity: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:relationentityId').put(Validator.update, Controller.update)
// router.route('/:relationentityId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /relationentity/{relationentityId}:
 *     delete:
 *       summary: 删除关系实体
 *       tags: [关系实体]
 *       parameters:
 *         - name: relationentityId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             relationentity: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:relationentityId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /relationentity/{relationentityId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [关系实体]
 *       parameters:
 *         - name: relationentityId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             relationentity: string
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
router.route('/:relationentityId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
