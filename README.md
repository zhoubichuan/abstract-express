# 订单后台接口

## 一、这是个什么的项目？

基于 Node.js express 实战开发的一套完整的订单项目，适合多端的 RESTful API，同时配套完整的后台管理系统，基于 Vue.js 前后端分离的前端界面。

## 二、Node.js Express 服务端 RESTful API

- [x] 管理员与权限控制接口
- [x] 订单管理接口
- [x] 产品管理接口
- [x] 合同接口
- [x] 合同标签接口
- [x] 用户接口
- [x] 客户接口，与客户标签与付款方式关联
- [x] 客户标签接口
- [x] 客户付款方式接口


``` bash
# 安装项目依赖
npm install

# 导入 blog 数据库
mongorestore -h localhost:27017 -d blog 你的本地路径(数据库文件在这项目的 db\blog\ 文件夹里)

# 导出全部数据库
mongodump --host localhost:27017 -o 保存数据库文件目录的绝对地址(D:\Code\project\node\cwf-order\db)

# 启动项目于localhost:3000
npm run start








