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
var $filterObj = function (target, keys) {
  let result = {}
  keys.forEach(key => {
    result[key] = target[key]
  })
  return result
}

var Tag = require('./../app/models/systemTag')
// 数据实体列表查询
router.post('/getTagList', async (req, res, next) => {
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
  console.log(req.body)
  let conditions = {}
  code && (conditions.code = new RegExp(code, 'i'))
  name && (conditions.name = new RegExp(name, 'i'))
  nameEn && (conditions.nameEn = new RegExp(nameEn, 'i'))
  state.length && (conditions.state = state)
  parentId && (conditions.parentId = new RegExp(parentId, 'i'))
  entityTyep && (conditions.entityTyep = entityTyep)
  version && (conditions.version = version)
  modelType && (conditions.modelType = modelType)
  selectFunction.length && (conditions.selectFunction = selectFunction)
  creater && (conditions.creater = creater)
  // eos && (conditions.eos = eos)
  // tags && (conditions.tags = tags)

  const total = await Tag.find().count()
  Tag.find(conditions)
    .sort({
      '_id': -1
    })
    .skip(curPage)
    .limit(pageSize)
    .exec()
    .then((Tag) => {
      console.log(Tag)
      if (Tag.length) {
        res.json({
          status: '1',
          result: Tag,
          page: {
            total,
            curPage,
            pageSize
          }
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Tag',
          result: ''
        })
      }
    })
})

// 获取数据实体详情
router.post('/getTagDetail', (req, res, next) => {
  const {id} = req.body
  
  Tag.findOne({id})
    .then((result) => {
      if (result) {
        console.log(result)
        let keys = ['id','code','state', 'nameEn', 'name', 'descriptEn', 'descript', 'parentId', 'storeType', 'modelType', 'inherit', 'tableName', 'version', 'creater','creatTime','modifier','modifyTime']
        let data = $filterObj(result, keys)
        res.json({
          status: '1',
          msg: '',
          result: data
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Tag',
          result: ''
        })
      }
    })
})

// 创建数据实体
router.post('/createTag', (req, res, next) => {
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
  } = req.body
  Tag.findOne({nameEn}).then((result) => {
    if (result) {
      return res.status(400).json({
        status: '0',
        msg: '产品已存在',
        result: ''
      });
    } else {
      let newTag = {
        nameEn,
        name,
        descriptEn,
        descript,
        parentId,
        modelType,
        storeType,
        inherit,
        tableName
      };

      let TagEntity = new Tag(newTag)
      TagEntity.save(err => {
        if (err) {
          res.json({
            status: '0',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '1',
            msg: '产品创建成功',
            result: ''
          })
        }
      })
    }
  })
})

// 更新数据实体
router.put('/updateTag', (req, res, next) => {
  let keys = ['id', 'nameEn', 'name', 'descriptEn', 'descript', 'parentId', 'storeType', 'modelType', 'inherit', 'tableName']
  let params = $filterObj(req.body, keys)
  Tag.updateOne({id:params.id}, params, (err, result) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      Tag.findOne({id: params.id})
      .then((result) => {
        if (result) {
          res.json({
            status: '1',
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
router.delete('/deleteTag', (req, res, next) => {
  const arr = req.body;
  Tag.remove({
    _id: {
      $in: arr
    }
  }).then((Tag) => {
    if (Tag) {
      res.status(200).json({
        status: '1',
        msg: '删除成功',
        result: ''
      })
    } else {
      res.status(400).json({
        status: '0',
        msg: '不存在',
        result: ''
      })
    }
  })
})


// 数据实体基本属性列表查询
router.get('/getTagBaseAttrList', (req, res, next) => {
  Tag.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((Tag) => {
      if (Tag.length) {
        res.json({
          status: '1',
          msg: '',
          result: Tag
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Tag',
          result: ''
        })
      }
    })
})

// 数据实体基本属性详情查询
router.get('/getTagBaseAttrDetail:id', (req, res, next) => {
  const {id} = req.params;
  Tag.find({
    id
    })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((Tag) => {
      if (Tag) {
        res.json({
          status: '1',
          msg: '',
          result: Tag
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Tag',
          result: ''
        })
      }
    })
})

// 数据实体基本属性创建
router.post('/createTagBaseAttr', (req, res, next) => {
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
  Tag.findOne({nameEn}).then((result) => {
    if (result) {
      return res.status(400).json({
        status: '0',
        msg: '产品已存在',
        result: ''
      });
    } else {
      let newTag = {
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

      let TagEntity = new Tag(newTag)
      TagEntity.save(err => {
        if (err) {
          res.json({
            status: '0',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '1',
            msg: '产品创建成功',
            result: ''
          })
        }
      })
    }
  })
})

// 数据实体基本属性更新
router.put('/updateTagBaseAttr', (req, res, next) => {
  const {id} = req.params;
  Tag.updateOne({
    id
  }, req.body, (err, Tag) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).send(Tag);
    }
  })
})

// 数据实体基本属性删除
router.delete('/updateTagBaseAttrDelete', (req, res, next) => {
  const {id} = req.params;
  Tag.deleteOne({
    _id: id
  }).then((Tag) => {
    if (Tag) {
      res.status(200).json({
        status: '1',
        msg: '删除成功',
        result: ''
      })
    } else {
      res.status(400).json({
        status: '0',
        msg: '不存在',
        result: ''
      })
    }
  })
})







// 数据实体扩展属性列表查询
router.get('/getTagExtendAttrList', (req, res, next) => {
  Tag.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((Tag) => {
      if (Tag.length) {
        res.json({
          status: '1',
          msg: '',
          result: Tag
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Tag',
          result: ''
        })
      }
    })
})

// 数据实体基本属性详情查询
router.get('/getTagBaseAttrDetail:id', (req, res, next) => {
  const {id} = req.params;
  Tag.find({
    id
    })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((Tag) => {
      if (Tag) {
        res.json({
          status: '1',
          msg: '',
          result: Tag
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Tag',
          result: ''
        })
      }
    })
})

// 数据实体基本属性创建
router.post('/createTagExtendAttr', (req, res, next) => {
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
  Tag.findOne({nameEn}).then((result) => {
    if (result) {
      return res.status(400).json({
        status: '0',
        msg: '产品已存在',
        result: ''
      });
    } else {
      let newTag = {
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

      let TagEntity = new Tag(newTag)
      TagEntity.save(err => {
        if (err) {
          res.json({
            status: '0',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '1',
            msg: '产品创建成功',
            result: ''
          })
        }
      })
    }
  })
})

// 数据实体扩展属性更新
router.put('/updateTagExtendAttr', (req, res, next) => {
  const {id} = req.params;
  Tag.updateOne({
    id
  }, req.body, (err, Tag) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).send(Tag);
    }
  })
})

// 数据实体基本属性删除
router.delete('/updateTagExtendAttrDelete', (req, res, next) => {
  const {id} = req.params;
  Tag.deleteOne({
    _id: id
  }).then((Tag) => {
    if (Tag) {
      res.status(200).json({
        status: '1',
        msg: '删除成功',
        result: ''
      })
    } else {
      res.status(400).json({
        status: '0',
        msg: '不存在',
        result: ''
      })
    }
  })
})



// 数据实体父模型属性列表查询
router.get('/getTagParentAttrList', (req, res, next) => {
  Tag.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((Tag) => {
      if (Tag.length) {
        res.json({
          status: '1',
          msg: '',
          result: Tag
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Tag',
          result: ''
        })
      }
    })
})

// 数据实体父模型属性详情查询
router.get('/getTagParentAttrDetail:id', (req, res, next) => {
  const {id} = req.params;
  Tag.find({
    id
    })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((Tag) => {
      if (Tag) {
        res.json({
          status: '1',
          msg: '',
          result: Tag
        })
      } else {
        res.json({
          status: '0',
          msg: '没有Tag',
          result: ''
        })
      }
    })
})
module.exports = router