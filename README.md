# abstract-express

## 1.后端部分

## 1.1 启动项目

- 技术栈：express.js+mongodb+redis

```sh
npm install
mongorestore -h localhost:27017 -d blog 你的本地路径(数据库文件在这项目的 db\blog\ 文件夹里)
mongodump --host localhost:27017 -o 保存数据库文件目录的绝对地址(D:\Code\project\node\cwf-order\db)
npm run dev
```

### 1.2 配置文件

- `.env`中配置数据库以及环境变量

### 1.3 支持单元测试

`__tests__`

```sh
npm run test
```

### 1.4 支持 Docker 部署

```sh
sudo docker-compose up -d
```

### 1.5 swagger

(http://localhost:7005/api/docs)[http://localhost:7005/api/docs]
