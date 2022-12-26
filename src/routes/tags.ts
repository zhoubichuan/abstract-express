import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/tags'
import Validator  from '../validators/tags'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /tags
// list:                GET       - /tags
// details:             GET       - /tags/:tagsId
// update:              PUT       - /tags/:tagsId
// delete:              DELETE    - /tags/:tagsId
// a secure action:     POST      - /tags/:tagsId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /tags/:
 *     post:
 *       summary: 创建标签
 *       tags: [标签]
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
 *   /tags/:
 *     get:
 *       summary: 获取标签列表
 *       tags: [标签]
 *       responses:
 *         "200":
 *           description: Gets a list of tags as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 tags: object
 *                 properties:
 *                   success:
 *                     tags: boolean
 *                     description: Response Status
 *                   result:
 *                     tags: array
 *                     items:
 *                       tags: object
 *                       properties:
 *                         total:
 *                           tags: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /tags/{tagsId}:
 *     get:
 *       summary: 获取标签详情
 *       tags: [标签]
 *       parameters:
 *         - name: tagsId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             tags: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:tagsId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /tags/{tagsId}:
 *     put:
 *       summary: 更新标签
 *       tags: [标签]
 *       parameters:
 *         - name: tagsId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             tags: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:tagsId').put(Validator.update, Controller.update)
// router.route('/:tagsId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /tags/{tagsId}:
 *     delete:
 *       summary: 删除标签
 *       tags: [标签]
 *       parameters:
 *         - name: tagsId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             tags: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:tagsId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /tags/{tagsId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [标签]
 *       parameters:
 *         - name: tagsId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             tags: string
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
router.route('/:tagsId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
