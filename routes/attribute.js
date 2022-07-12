var express = require('express')
var router = express.Router()
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs')
var path = require('path')
var multipartMiddleware = require('connect-multiparty')()
var {
  signRequired,
  adminRole
} = require('../middleware/auth.js')
var formidable = require('formidable')
var $filterObj = function (target, keys) {
  let result = {}
  keys.forEach(key => {
    result[key] = target[key]
  })
  return result
}
var Attribute = require('./../app/models/attribute')
// 数据实体列表查询
router.post('/getAttributeList', async (req, res, next) => {
  let {
    code,
    name,
    nameEn,
    state = [],
    parentId,
    entityTyep,
    version,
    modelType,
    selectFunction = [],
    creater,
    eos,
    tags,
    curPage = 1,
    pageSize = 20
  } = req.body
  let conditions = {}
  code && (conditions.code = new RegExp(code, 'i'))
  name && (conditions.name = new RegExp(name, 'i'))
  nameEn && (conditions.nameEn = new RegExp(nameEn, 'i'))
  // state.length && (conditions.state = state)
  parentId && (conditions.parentId = new RegExp(parentId, 'i'))
  entityTyep && (conditions.entityTyep = entityTyep)
  version && (conditions.version = version)
  modelType && (conditions.modelType = modelType)
  selectFunction.length && (conditions.selectFunction = selectFunction)
  creater && (conditions.creater = creater)
  // eos && (conditions.eos = eos)
  // tags && (conditions.tags = tags)

  const total = await Attribute.find().count()
  Attribute.find(conditions)
    .sort({
      '_id': -1
    })
    .skip(curPage)
    .limit(pageSize)
    .exec()
    .then((Attribute) => {
      console.log(Attribute)
      if (Attribute.length) {
        res.json({
          status: 200,
          result: Attribute,
          page: {
            total,
            curPage,
            pageSize
          }
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Attribute',
          result: ''
        })
      }
    })
})

// 获取数据实体详情
router.post('/getAttributeDetail', (req, res, next) => {
  const { id } = req.body

  Attribute.findOne({ code: id })
    .then((result) => {
      if (result) {
        console.log(result)
        let keys = ['code', 'code', 'state', 'nameEn', 'name', 'descriptEn', 'descript', 'parentId', 'storeType', 'modelType', 'inherit', 'tableName', 'version', 'creater', 'creatTime', 'modifier', 'modifyTime', 'image', 'video']
        let data = $filterObj(result, keys)
        res.json({
          status: 200,
          msg: '查询成功',
          result: data
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Attribute',
          result: ''
        })
      }
    })
})

// 创建数据实体
router.post('/createAttribute', async (req, res, next) => {
  const {
    nameEn,
    name,
    descriptEn,
    descript,
    parentId,
    modelType,
    storeType,
    inherit,
    tableName,
    image,
    video
  } = req.body
  let result = await Attribute.findOne({ nameEn })
  if (result) {
    return res.status(200).json({
      status: '0',
      msg: '产品已存在',
      result: ''
    });
  } else {
    let newAttribute = {
      nameEn,
      name,
      descriptEn,
      descript,
      parentId,
      modelType,
      storeType,
      inherit,
      tableName,
      image,
      video
    };

    let AttributeEntity = new Attribute(newAttribute)
    AttributeEntity.save(err => {
      if (err) {
        res.json({
          status: '0',
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: 200,
          msg: '模型创建成功',
          result: ''
        })
      }
    })
  }
})

// 更新数据实体
router.put('/updateAttribute', (req, res, next) => {
  let keys = ['id', 'nameEn', 'name', 'descriptEn', 'descript', 'parentId', 'storeType', 'modelType', 'inherit', 'tableName', 'image', 'video']
  let params = $filterObj(req.body, keys)
  Attribute.updateOne({ id: params.id }, params, (err, result) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      Attribute.findOne({ id: params.id })
        .then((result) => {
          if (result) {
            res.json({
              status: 200,
              msg: '更新成功',
              result: result
            })
          } else {
            res.json({
              status: '0',
              msg: '没有查询出数据实体',
              result: ''
            })
          }
        })

    }
  })
})

// 删除数据实体
router.delete('/deleteAttribute', (req, res, next) => {
  const arr = req.body;
  Attribute.remove({
    _id: {
      $in: arr
    }
  }).then((Attribute) => {
    if (Attribute) {
      res.status(200).json({
        status: 200,
        msg: '删除成功',
        result: ''
      })
    } else {
      res.status(200).json({
        status: '0',
        msg: '不存在',
        result: ''
      })
    }
  })
})


// 数据实体基本属性列表查询
router.get('/getAttributeBaseAttrList', (req, res, next) => {
  Attribute.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((Attribute) => {
      if (Attribute.length) {
        res.json({
          status: 200,
          msg: '',
          result: Attribute
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Attribute',
          result: ''
        })
      }
    })
})

// 数据实体基本属性详情查询
router.get('/getAttributeBaseAttrDetail:id', (req, res, next) => {
  const { id } = req.params;
  Attribute.find({
    id
  })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((Attribute) => {
      if (Attribute) {
        res.json({
          status: 200,
          msg: '',
          result: Attribute
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Attribute',
          result: ''
        })
      }
    })
})

// 数据实体基本属性创建
router.post('/createAttributeBaseAttr', (req, res, next) => {
  const {
    nameEn,
    name,
    descriptEn,
    descript,
    parentId,
    modelType,
    storeType,
    inherit,
    tableName,
    version,
    creater,
    creatTime,
    modifierr,
    modifyTime
  } = req.body
  Attribute.findOne({ nameEn }).then((result) => {
    if (result) {
      return res.status(200).json({
        status: '0',
        msg: '产品已存在',
        result: ''
      });
    } else {
      let newAttribute = {
        nameEn,
        name,
        descriptEn,
        descript,
        parentId,
        modelType,
        storeType,
        inherit,
        tableName,
        version,
        creater,
        creatTime,
        modifierr,
        modifyTime
      };

      let AttributeEntity = new Attribute(newAttribute)
      AttributeEntity.save(err => {
        if (err) {
          res.json({
            status: '0',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: 200,
            msg: '产品创建成功',
            result: ''
          })
        }
      })
    }
  })
})

// 数据实体基本属性更新
router.put('/updateAttributeBaseAttr', (req, res, next) => {
  const { id } = req.params;
  Attribute.updateOne({
    id
  }, req.body, (err, Attribute) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).send(Attribute);
    }
  })
})

// 数据实体基本属性删除
router.delete('/updateAttributeBaseAttrDelete', (req, res, next) => {
  const { id } = req.params;
  Attribute.deleteOne({
    _id: id
  }).then((Attribute) => {
    if (Attribute) {
      res.status(200).json({
        status: 200,
        msg: '删除成功',
        result: ''
      })
    } else {
      res.status(200).json({
        status: '0',
        msg: '不存在',
        result: ''
      })
    }
  })
})
// 数据实体扩展属性列表查询
router.get('/getAttributeExtendAttrList', (req, res, next) => {
  Attribute.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((Attribute) => {
      if (Attribute.length) {
        res.json({
          status: 200,
          msg: '',
          result: Attribute
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Attribute',
          result: ''
        })
      }
    })
})

// 数据实体基本属性详情查询
router.get('/getAttributeBaseAttrDetail:id', (req, res, next) => {
  const { id } = req.params;
  Attribute.find({
    id
  })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((Attribute) => {
      if (Attribute) {
        res.json({
          status: 200,
          msg: '',
          result: Attribute
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Attribute',
          result: ''
        })
      }
    })
})

// 数据实体基本属性创建
router.post('/createAttributeExtendAttr', (req, res, next) => {
  const {
    nameEn,
    name,
    descriptEn,
    descript,
    parentId,
    modelType,
    storeType,
    inherit,
    tableName,
    version,
    creater,
    creatTime,
    modifierr,
    modifyTime
  } = req.body
  Attribute.findOne({ nameEn }).then((result) => {
    if (result) {
      return res.status(200).json({
        status: '0',
        msg: '产品已存在',
        result: ''
      });
    } else {
      let newAttribute = {
        nameEn,
        name,
        descriptEn,
        descript,
        parentId,
        modelType,
        storeType,
        inherit,
        tableName,
        version,
        creater,
        creatTime,
        modifierr,
        modifyTime
      };

      let AttributeEntity = new Attribute(newAttribute)
      AttributeEntity.save(err => {
        if (err) {
          res.json({
            status: '0',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: 200,
            msg: '产品创建成功',
            result: ''
          })
        }
      })
    }
  })
})

// 数据实体扩展属性更新
router.put('/updateAttributeExtendAttr', (req, res, next) => {
  const { id } = req.params;
  Attribute.updateOne({
    id
  }, req.body, (err, Attribute) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).send(Attribute);
    }
  })
})

// 数据实体基本属性删除
router.delete('/updateAttributeExtendAttrDelete', (req, res, next) => {
  const { id } = req.params;
  Attribute.deleteOne({
    _id: id
  }).then((Attribute) => {
    if (Attribute) {
      res.status(200).json({
        status: 200,
        msg: '删除成功',
        result: ''
      })
    } else {
      res.status(200).json({
        status: '0',
        msg: '不存在',
        result: ''
      })
    }
  })
})



// 数据实体父模型属性列表查询
router.get('/getAttributeParentAttrList', (req, res, next) => {
  Attribute.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((Attribute) => {
      if (Attribute.length) {
        res.json({
          status: 200,
          msg: '',
          result: Attribute
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Attribute',
          result: ''
        })
      }
    })
})

// 数据实体父模型属性详情查询
router.get('/getAttributeParentAttrDetail:id', (req, res, next) => {
  const { id } = req.params;
  Attribute.find({
    id
  })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((Attribute) => {
      if (Attribute) {
        res.json({
          status: 200,
          msg: '',
          result: Attribute
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Attribute',
          result: ''
        })
      }
    })
})

router.post('/image', (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.encoding = 'utf-8' // 编码
  form.keepExtensions = true // 保留扩展名
  form.uploadDir = path.join(__dirname, '../public/images/') //文件存储路径 最后要注意加 '/' 否则会被存在public下
  form.parse(req, (err, fileds, files) => { // 解析 formData 数据
    if (err) return next(err)
    let oldPath = files.file.filepath //获取文件路径 ~/public/images/<随机生成的文件名>.<扩展名>
    let type = files.file.mimetype.split('/')[1]
    let imgname = files.file.newFilename + '.' + type //前台上传时的文件名 也就是文件原本的名字
    let newPath = path.join(path.dirname(oldPath), imgname)
    fs.rename(oldPath, newPath, (err) => {
      if (err) return next(err)
      res.json({ url: 'http://localhost:7005/images/' + imgname })
    })
  })
})
router.post('/video', (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.encoding = 'utf-8' // 编码
  form.keepExtensions = true // 保留扩展名
  form.uploadDir = path.join(__dirname, '../public/images/') //文件存储路径 最后要注意加 '/' 否则会被存在public下
  form.parse(req, (err, fileds, files) => { // 解析 formData 数据
    if (err) return next(err)
    let oldPath = files.file.filepath //获取文件路径 ~/public/images/<随机生成的文件名>.<扩展名>
    let type = files.file.mimetype.split('/')[1]
    let imgname = files.file.newFilename + '.' + type //前台上传时的文件名 也就是文件原本的名字
    let newPath = path.join(path.dirname(oldPath), imgname)
    fs.rename(oldPath, newPath, (err) => {
      if (err) return next(err)
      res.json({ url: 'http://localhost:7005/images/' + imgname })
    })
  })
})
module.exports = router