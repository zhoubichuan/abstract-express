import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/feuser'
import Validator  from '../validators/feuser'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /feuser
// list:                GET       - /feuser
// details:             GET       - /feuser/:feuserId
// update:              PUT       - /feuser/:feuserId
// delete:              DELETE    - /feuser/:feuserId
// a secure action:     POST      - /feuser/:feuserId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /feuser/:
 *     post:
 *       summary: 创建账户
 *       tags: [账户操作]
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
 *   /feuser/:
 *     get:
 *       summary: 获取账户列表
 *       tags: [账户操作]
 *       responses:
 *         "200":
 *           description: Gets a list of feuser as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 feuser: object
 *                 properties:
 *                   success:
 *                     feuser: boolean
 *                     description: Response Status
 *                   result:
 *                     feuser: array
 *                     items:
 *                       feuser: object
 *                       properties:
 *                         total:
 *                           feuser: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /feuser/{feuserId}:
 *     get:
 *       summary: 获取账户详情
 *       tags: [账户操作]
 *       parameters:
 *         - name: feuserId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             feuser: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:feuserId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /feuser/{feuserId}:
 *     put:
 *       summary: 更新账户
 *       tags: [账户操作]
 *       parameters:
 *         - name: feuserId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             feuser: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:feuserId').put(Validator.update, Controller.update)
// router.route('/:feuserId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /feuser/{feuserId}:
 *     delete:
 *       summary: 删除账户
 *       tags: [账户操作]
 *       parameters:
 *         - name: feuserId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             feuser: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:feuserId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /feuser/{feuserId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [账户操作]
 *       parameters:
 *         - name: feuserId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             feuser: string
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
router.route('/:feuserId/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
