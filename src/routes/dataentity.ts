import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/dataentity'
import Validator  from '../validators/dataentity'
import { checkToken, checkRole }  from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /dataEntity/create
// list:                POST      - /dataEntity/list
// details:             GET       - /dataEntity/:id
// update:              PUT       - /dataEntity/:id
// delete:              DELETE    - /dataEntity/:id
// pathdelete:          DELETE    - /dataEntity/pathdelete
// a secure action:     POST      - /dataEntity/:id/secure-action

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
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataEntityList'
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('/list').post(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /dataEntity/{id}:
 *     get:
 *       summary: 获取实体详情
 *       tags: [数据实体]
 *       parameters:
 *         - name: 6461042f7063568e742668d9
 *           in: path
 *           description: 数据实体id
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
router.route('/:id').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /dataEntity/{id}:
 *     put:
 *       summary: 更新实体
 *       tags: [数据实体]
 *       parameters:
 *         - name: 6461042f7063568e742668d9
 *           in: path
 *           description: 数据实体id
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
router.route('/:id').put(Validator.update, Controller.update)
// router.route('/:id').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /dataEntity/{id}:
 *     delete:
 *       summary: 删除实体
 *       tags: [数据实体]
 *       parameters:
 *         - name: id
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
router.route('/:id').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /dataEntity/{id}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [数据实体]
 *       parameters:
 *         - name: id
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
 *   /dataEntity/{id}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [数据实体]
 *       parameters:
 *         - name: id
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
router.route('/:id/secure-action').post(
  checkToken,
  checkRole,
  Validator.secureAction,
  Controller.secureAction
)

export default router
