import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/type'
import Validator  from '../validators/type'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /type
// list:                GET       - /type
// details:             GET       - /type/:typeId
// update:              PUT       - /type/:typeId
// delete:              DELETE    - /type/:typeId
// a secure action:     POST      - /type/:typeId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /type/:
 *     post:
 *       summary: 创建类型
 *       tags: [客户类型]
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
 *   /type/:
 *     get:
 *       summary: 获取类型列表
 *       tags: [客户类型]
 *       responses:
 *         "200":
 *           description: Gets a list of type as an array of objects
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
 *   /type/{typeId}:
 *     get:
 *       summary: 获取类型详情
 *       tags: [客户类型]
 *       parameters:
 *         - name: typeId
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
router.route('/:typeId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /type/{typeId}:
 *     put:
 *       summary: 更新类型
 *       tags: [客户类型]
 *       parameters:
 *         - name: typeId
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
router.route('/:typeId').put(Validator.update, Controller.update)
// router.route('/:typeId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /type/{typeId}:
 *     delete:
 *       summary: 删除类型
 *       tags: [客户类型]
 *       parameters:
 *         - name: typeId
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
router.route('/:typeId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /type/{typeId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [客户类型]
 *       parameters:
 *         - name: typeId
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
router.route('/:typeId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
