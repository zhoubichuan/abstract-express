var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var session = require('express-session')
// var MongoStore = require('connect-mongo')(session)
var bodyParser = require('body-parser')
var routes = require('./routes/index')
const jwt = require('jsonwebtoken');
const mongodb = require('./mongodb.js');
const expressJwt = require('express-jwt')
//秘钥
var signkey = 'mes_qdhd_mobile';
//生成token
const setToken = function (username) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({
      username: username
    }, signkey, { expiresIn: 60 * 60 * 24 * 3 });
    // let info = jwt.verify(token.split(' ')[1], signkey)
    // console.log(info);
    console.log('token', token);
    resolve(token);
  })
}
//验证token
const verToken = function (token) {
  return new Promise((resolve, reject) => {
    var info = jwt.verify(token, signkey, (error, decoded) => {
      if (error) {
        console.log(error.message)
        return
      }
      console.log(decoded)
    });
    resolve(info);
  })
}

var app = express()



// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('port', port)

// uncomment after placing your favicon in /public
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser('ordersecrettoken'))
app.use(session({
  secret: 'ordersecrettoken',
  cookie: {
    maxAge: 24 * 3600 * 1000 * 7
  },
  // store: new MongoStore({
  //   url: 'mongodb://zhoubichuan.com:27017/blog'
  // }),
  resave: false,
  saveUninitialized: false
}))

// 解析token获取用户信息
app.use(function (req, res, next) {
  var token = req.headers['authorization'];
  if (token == undefined) {
    return next();
  } else {
    verToken(token).then((data) => {
      req.data = data;
      return next();
    }).catch((error) => {
      console.log(error);
      return next();
    })
  }
});


// 访问静态资源目录
app.use(express.static(path.join(__dirname, 'public')))

// 记录访问次数
app.use((req, res, next) => {
  // if (req.session.views) {
  //   req.session.views++
  //   console.log(`欢迎第 ${req.session.views} 次访问`)
  //   next()
  // } else {
  //   req.session.views = 1
  //   console.log(`欢迎首次访问`)
  next()
  // }
})

// 校验token，获取headers⾥里里的Authorization的token，要写在路由加载之前，静态资源之后
//验证token是否过期并规定哪些路由不用验证
// app.use(expressJwt({
//   secret: 'mes_qdhd_mobile',
//   algorithms: ['HS256'],
//   credentialsRequired:true
// }).unless({
//   path: ['/', '/users/login']//除了这个地址，其他的URL都需要验证
// }));


Object.keys(routes).forEach(key => {
  app.use('/api', routes[key])
})
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  if (err.name === 'UnauthorizedError') {
    console.error(req.path + ',无效token');
    res.json({
      message: 'token过期，请重新登录',
      code: 400
    })
    return
  }
  res.status(err.status || 500)
  res.render('error')
})

var port = normalizePort(process.env.PORT || '7005');

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

const server = app.listen(port, 'localhost', () => {
  const host = server.address().address
  const port = server.address().port
  console.log("server started! 访问地址为 http://%s:%s", host, port)
});