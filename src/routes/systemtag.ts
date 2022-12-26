import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/systemtag'
import Validator  from '../validators/systemtag'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /systemtag
// list:                GET       - /systemtag
// details:             GET       - /systemtag/:systemtagId
// update:              PUT       - /systemtag/:systemtagId
// delete:              DELETE    - /systemtag/:systemtagId
// a secure action:     POST      - /systemtag/:systemtagId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /systemtag/:
 *     post:
 *       summary: 创建标签
 *       tags: [系统标签]
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
 *   /systemtag/:
 *     get:
 *       summary: 获取标签列表
 *       tags: [系统标签]
 *       responses:
 *         "200":
 *           description: Gets a list of systemtag as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 systemtag: object
 *                 properties:
 *                   success:
 *                     systemtag: boolean
 *                     description: Response Status
 *                   result:
 *                     systemtag: array
 *                     items:
 *                       systemtag: object
 *                       properties:
 *                         total:
 *                           systemtag: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /systemtag/{systemtagId}:
 *     get:
 *       summary: 获取标签详情
 *       tags: [系统标签]
 *       parameters:
 *         - name: systemtagId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             systemtag: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:systemtagId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /systemtag/{systemtagId}:
 *     put:
 *       summary: 更新标签
 *       tags: [系统标签]
 *       parameters:
 *         - name: systemtagId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             systemtag: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:systemtagId').put(Validator.update, Controller.update)
// router.route('/:systemtagId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /systemtag/{systemtagId}:
 *     delete:
 *       summary: 删除标签
 *       tags: [系统标签]
 *       parameters:
 *         - name: systemtagId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             systemtag: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:systemtagId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /systemtag/{systemtagId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [系统标签]
 *       parameters:
 *         - name: systemtagId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             systemtag: string
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
router.route('/:systemtagId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router