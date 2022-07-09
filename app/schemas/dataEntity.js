const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
// node.js 核心模块，提供了安全相关的功能，如加密，签名等
const crypto = require('crypto')
const uuid = require('node-uuid')

const dataEntitySchema = new mongoose.Schema({
  nameEn:{
    unique: true,
    type:String
  },
  name:String,
  descriptEn:String,
  descript:String,
  parentId:String,
  modelType:String,
  storeType:Boolean,
  inherit:Boolean,
  tableName:String,
  code: {
    type: String,
    defalut: uuid.v1()
  },
  state: {
    type: String,
    defalut: 'iwork'
  },
  id: {
    type: String,
    defalut: uuid.v1()
  },
  version: {
    type: String,
    defalut: 'A'
  },
  creater: {
    type: String,
    defalut: ''
  },
  createTime: {
    type: Date,
    defalut: Date.now()
  },
  modifier: {
    type: String,
    defalut: ''
  },
  modifyTime: {
    type: Date,
    defalut: Date.now()
  }
});

dataEntitySchema.pre('save', function(next) {
  if (this.isNew) {
    this.createTime = this.modifyTime = Date.now()
    this.version = 'A'
    this.state = 'iwork'
    this.code = 'DM'+uuid.v1()
    this.modifier = this.creater = 'zbc'
    this.id = uuid.v1()
  } else {
    this.modifyTime = Date.now()
    this.modifier='小王'
  }
  next()
})

module.exports = dataEntitySchema