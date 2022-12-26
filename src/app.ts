// ------ Import npm modules
import express from 'express'
import helmet from 'helmet'
import { urlencoded, json } from 'body-parser'

const app: express.Application = express()

// ------ Initialize & Use Middle-Wares
// app.set('trust proxy', 1)
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(helmet())

// ------ 全局配置
import config from './configs'
app.set('config', config)

// ------ 添加i18n国际化
import i18n from './services/i18n'
app.use(i18n.init)

// TODO: Add other caching systems (like 'RabbitMQ') in the future

// ------ Socket.io Integration
// import http   from 'http'
// import socket from 'socket.io'
// const server: http.Server = new http.Server(app)
// const io: socket.Server   = socket(server)
// app.set('io', io)

// ------ 跨域
import initCors from './middlewares/cors'
app.use(initCors)
app.all('*', function (req, res, next) {
    if (req.method.toLowerCase() == 'options') {
        res.send(200);  // 让options尝试请求快速结束
    } else {
        next();
    }
});

// ------ 添加redis
import redis from './services/redis'
app.set('redis', redis)

// ------ 添加jwt
// import { expressjwt } from 'express-jwt'
// app.use(expressjwt({ secret: config.jwt.key, algorithms: ["HS256"] }).unless({ path: ["/api/user/login"] }))

// ------ 全局方法
import * as methods from './services/methods'
app.set('methods', methods)

// ------ 添加日志
import logger from './middlewares/logger'
app.use(logger)

// ------ 配置路由
import router from './routes'
app.use('/api', router)

// ------ 全局响应拦截
import decorator from './middlewares/decorator'
app.use(decorator)

export default app