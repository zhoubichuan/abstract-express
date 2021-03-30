const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
// node.js 核心模块，提供了安全相关的功能，如加密，签名等
const crypto = require('crypto')
const uuid = require('node-uuid')

const DataModelSchema = new mongoose.Schema({
  nameEn:{
    unique: true,
    type:String
  },
  name:String,
  descriptEn:String,
  descript:String,
  id: {
    type: String,
    defalut: uuid.v1()
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

DataModelSchema.pre('save', function() {
  if (this.isNew) {
    this.createTime = this.modifyTime = Date.now()
    this.state = 'iwork'
    this.modifier = this.creater = 'zbc'
    this.id = uuid.v1()
  } else {
    this.modifyTime = Date.now()
    this.modifier='小王'
  }
  next()
})

module.exports = DataModelSchema