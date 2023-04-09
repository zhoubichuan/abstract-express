import { Request, Response, Router } from 'express'
const fs = require('fs')
const files = fs.readdirSync(__dirname)
const router: Router = Router()

// ------ Add JWT to chosen routes
// import jwt    from 'express-jwt'
// import config from '../configs/config'
// const JwtCheck = jwt({ secret: config.jwt.key })
// router.use('/samples', JwtCheck, sampleRouter)

// Sample APIs
// import sampleRouter from './sample'
import attributeRouter from './attribute'
import dataentityRouter from './dataentity'
import feuserRouter from './feuser'
import datainstanceRouter from './datainstance'
import datamodelRouter from './datamodel'
import orderRouter from './order'
import payRouter from './pay'
import productRouter from './product'
import relationentityRouter from './relationentity'
import systemtagRouter from './systemtag'
import tagsRouter from './tags'
import typeRouter from './type'
import userRouter from './user'

// router.use('/samples', sampleRouter)
router.use('/attribute', attributeRouter)
router.use('/dataentity', dataentityRouter)
router.use('/feuser', feuserRouter)
router.use('/instance', datainstanceRouter)
router.use('/model', datamodelRouter)
router.use('/order', orderRouter)
router.use('/pay', payRouter)
router.use('/product', productRouter)
router.use('/relationentity', relationentityRouter)
router.use('/systemtag', systemtagRouter)
router.use('/tags', tagsRouter)
router.use('/type', typeRouter)
router.use('/user', userRouter)

// API Documentation Swagger
import swaggerUi from 'swagger-ui-express'
import * as specs from '../services/swagger'
router.use('/docs', swaggerUi.serve)
router.get('/docs', swaggerUi.setup(specs, { explorer: true }))

files.forEach((item:string)=>{
    if (item === 'attribute.ts') {
        // router.use('/'+item, require('./' + item))
    }
})

// Health-check Endpoint
router.get('/health', (_req: Request, res: Response) => { res.send('200') })

export default router

// ------ Set Default Components for OpenAPI documentation
/**
 * @openapi
 * tags:
 *   name: Samples
 *   description: Sample management
 * components:
 *   responses:
 *     Success:
 *       description: 请求成功响应
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Success'
 *     BadRequest:
 *       description:  错误请求提要
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     NotFound:
 *       description: 找不到指定的资源
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     Unauthorized:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *         message:
 *           type: string
 *         body:
 *           type: object
 *       required:
 *         - statusCode
 *         - message
 *       example:
 *         statusCode: 400
 *         message: 'Some Error ...'
 *         body: null
 *     Success:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Response Status
 *         result:
 *           $ref: '#/components/schemas/Sample'
 */
