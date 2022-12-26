import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/attribute'
import Validator  from '../validators/attribute'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /attribute
// list:                GET       - /attribute
// details:             GET       - /attribute/:attributeId
// update:              PUT       - /attribute/:attributeId
// delete:              DELETE    - /attribute/:attributeId
// a secure action:     POST      - /attribute/:attributeId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /attribute/:
 *     post:
 *       summary: 创建属性
 *       tags: [模型属性]
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
 *   /attribute/:
 *     get:
 *       summary: 获取属性列表
 *       tags: [模型属性]
 *       responses:
 *         "200":
 *           description: Gets a list of attribute as an array of objects
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
 *   /attribute/{attributeId}:
 *     get:
 *       summary: 获取属性详情
 *       tags: [模型属性]
 *       parameters:
 *         - name: attributeId
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
router.route('/:attributeId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /attribute/{attributeId}:
 *     put:
 *       summary: 更新属性
 *       tags: [模型属性]
 *       parameters:
 *         - name: attributeId
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
router.route('/:attributeId').put(Validator.update, Controller.update)
// router.route('/:attributeId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /attribute/{attributeId}:
 *     delete:
 *       summary: 删除属性
 *       tags: [模型属性]
 *       parameters:
 *         - name: attributeId
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
router.route('/:attributeId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /attribute/{attributeId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [模型属性]
 *       parameters:
 *         - name: attributeId
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
router.route('/:attributeId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
