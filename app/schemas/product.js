const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
// node.js 核心模块，提供了安全相关的功能，如加密，签名等
const crypto = require('crypto')

const ProductSchema = new mongoose.Schema({
  nameEn:{
    unique: true,
    type:String
  },
  name:String,
  descriptEn:String,
  descript:String,
  parentModel:String,
  modelType:String,
  storeType:Boolean,
  inherit:Boolean,
  tableName:String,
  version: {
    type: String,
    defalut: 'A'
  },
  creater: {
    type: Date,
    defalut: Date.now()
  },
  createTime: {
    type: Date,
    defalut: Date.now()
  },
  modifier: {
    type: Date,
    defalut: Date.now()
  },
  modifyTime: {
    type: Date,
    defalut: Date.now()
  }
});

ProductSchema.pre('save', function() {
    if (this.isNew) {
        this.createTime = this.modifyTime = Date.now()
    } else {
        this.modifyTime = Date.now()
    }
    next()
})

module.exports = ProductSchema