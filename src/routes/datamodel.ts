import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/datamodel'
import Validator  from '../validators/datamodel'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /datamodel
// list:                GET       - /datamodel
// details:             GET       - /datamodel/:datamodelId
// update:              PUT       - /datamodel/:datamodelId
// delete:              DELETE    - /datamodel/:datamodelId
// a secure action:     POST      - /datamodel/:datamodelId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /datamodel:
 *     post:
 *       summary: 创建数据模型
 *       tags: [数据模型]
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
 *   /datamodel:
 *     get:
 *       summary: 获取数据模型列表
 *       tags: [数据模型]
 *       responses:
 *         "200":
 *           description: Gets a list of datamodel as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 datamodel: object
 *                 properties:
 *                   success:
 *                     datamodel: boolean
 *                     description: Response Status
 *                   result:
 *                     datamodel: array
 *                     items:
 *                       datamodel: object
 *                       properties:
 *                         total:
 *                           datamodel: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /datamodel/{datamodelId}:
 *     get:
 *       summary: 获取数据模型详情
 *       tags: [数据模型]
 *       parameters:
 *         - name: datamodelId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             datamodel: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:datamodelId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /datamodel/{datamodelId}:
 *     put:
 *       summary: 更新数据模型
 *       tags: [数据模型]
 *       parameters:
 *         - name: datamodelId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             datamodel: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:datamodelId').put(Validator.update, Controller.update)
// router.route('/:datamodelId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /datamodel/{datamodelId}:
 *     delete:
 *       summary: 删除数据模型
 *       tags: [数据模型]
 *       parameters:
 *         - name: datamodelId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             datamodel: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:datamodelId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /datamodel/{datamodelId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [数据模型]
 *       parameters:
 *         - name: datamodelId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             datamodel: string
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
router.route('/:datamodelId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
