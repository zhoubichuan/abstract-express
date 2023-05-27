import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/dataentity'
import Validator  from '../validators/dataentity'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /dataEntity
// list:                POST      - /dataEntity
// details:             GET       - /dataEntity/:dataEntityId
// update:              PUT       - /dataEntity/:dataEntityId
// delete:              DELETE    - /dataEntity/:dataEntityId
// pathdelete:          DELETE    - /dataEntity/pathdelete
// a secure action:     POST      - /dataEntity/:dataEntityId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /dataEntity/create:
 *     post:
 *       summary: 创建实体
 *       tags: [数据实体]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataEntity'
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('/create').post(Validator.create, Controller.create)

/**
 * @openapi
 * paths:
 *   /dataEntity/list:
 *     post:
 *       summary: 获取实体列表
 *       tags: [数据实体]
 *       responses:
 *         "200":
 *           description: Gets a list of dataEntity as an array of objects
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
router.route('/list').post(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /dataEntity/{dataEntityId}:
 *     get:
 *       summary: 获取实体详情
 *       tags: [数据实体]
 *       parameters:
 *         - name: dataEntityId
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
router.route('/:dataEntityId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /dataEntity/{dataEntityId}:
 *     put:
 *       summary: 更新实体
 *       tags: [数据实体]
 *       parameters:
 *         - name: dataEntityId
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
router.route('/:dataEntityId').put(Validator.update, Controller.update)
// router.route('/:dataEntityId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /dataEntity/{dataEntityId}:
 *     delete:
 *       summary: 删除实体
 *       tags: [数据实体]
 *       parameters:
 *         - name: dataEntityId
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
router.route('/:dataEntityId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /dataEntity/{dataEntityId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [数据实体]
 *       parameters:
 *         - name: dataEntityId
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
router.route('/pathdelete').delete(Validator.pathdelete,Controller.pathdelete)

/**
 * @openapi
 * paths:
 *   /dataEntity/{dataEntityId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [数据实体]
 *       parameters:
 *         - name: dataEntityId
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
router.route('/:dataEntityId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
