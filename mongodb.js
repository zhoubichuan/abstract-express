var mongoose = require('mongoose')
mongoose.set("strictQuery", false)
global.__base = __dirname + '/'
mongoose.Promise = global.Promise
const dburl = "mongodb://zhoubichuan.com:27017/blog";

mongoose.connect(dburl, {
  authSource: "admin", // 权限认证（添加这个属性！！！！！）
  user: "root",
  pass: "ZBCzbc123",
  bufferCommands: true,
  useNewUrlParser: true,
}).then(() => console.log('Database Successful！')).catch((err) => console.log(err));

mongoose.connection.on('error', () => {
  console.log('Mongodb connected fail!')
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongodb disconnected!')
})

module.exports=mongoose