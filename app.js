var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var bodyParser = require('body-parser')

var index = require('./routes/index')
var users = require('./routes/users')
var clients = require('./routes/clients')
var tags = require('./routes/tags')
var pays = require('./routes/pay')
var orders = require('./routes/order')
var products = require('./routes/product')
let dataEntity = require('./routes/dataEntity')
let attribute = require('./routes/attribute')
let relationEntity = require('./routes/relationEntity')
let dataInstance = require('./routes/dataInstance')
let systemTag = require('./routes/systemTag')
const jwt = require('jsonwebtoken');
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

var mongoose = require('mongoose')
global.__base = __dirname + '/'
mongoose.Promise = global.Promise
const dburl = "mongodb://localhost:27017/blog";

mongoose.connect(dburl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => console.log('Database Successful！')).catch((err) => console.log(err));



mongoose.connection.on('error', () => {
  console.log('Mongodb connected fail!')
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongodb disconnected!')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('port', port)

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
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
  store: new MongoStore({
    url: 'mongodb://81.71.127.69:27017/blog'
  }),
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

app.use('/', index)
app.use('/users', users)
app.use('/clients', clients)
app.use('/tag', tags)
app.use('/pay', pays)
app.use('/order', orders)
app.use('/product', products)
app.use('/dataEntity', dataEntity)
app.use('/attribute', attribute)
app.use('/relationEntity', relationEntity)
app.use('/dataInstance', dataInstance)
app.use('/systemBaseInfo', systemTag)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
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
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

var port = normalizePort(process.env.PORT || '7005');

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

const server = app.listen(port, 'localhost', () => {
  const host = server.address().address
  const port = server.address().port
  console.log("server started! 访问地址为 http://%s:%s", host, port)
});