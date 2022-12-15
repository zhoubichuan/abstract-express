# 抽象数据管理系统

## 1.后端部分

- 技术栈：express.js+mongodb

```bash
# 安装项目依赖
npm install

# 导入 blog 数据库
mongorestore -h localhost:27017 -d blog 你的本地路径(数据库文件在这项目的 db\blog\ 文件夹里)

# 导出全部数据库
mongodump --host localhost:27017 -o 保存数据库文件目录的绝对地址(D:\Code\project\node\cwf-order\db)

# 启动项目于localhost:3000
npm run dev
```
