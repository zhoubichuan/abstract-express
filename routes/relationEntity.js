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

var RelationEntity = require('./../app/models/relationEntity')
// 数据实体列表查询
router.post('/getRelationEntityList', async (req, res, next) => {
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
  // state.length && (conditions.state = state)
  parentId && (conditions.parentId = new RegExp(parentId, 'i'))
  entityTyep && (conditions.entityTyep = entityTyep)
  version && (conditions.version = version)
  modelType && (conditions.modelType = modelType)
  selectFunction.length && (conditions.selectFunction = selectFunction)
  creater && (conditions.creater = creater)
  // eos && (conditions.eos = eos)
  // tags && (conditions.tags = tags)

  const total = await RelationEntity.find().count()
  RelationEntity.find(conditions)
    .sort({
      '_id': -1
    })
    .skip(curPage)
    .limit(pageSize)
    .exec()
    .then((RelationEntity) => {
      console.log(RelationEntity)
      if (RelationEntity.length) {
        res.json({
          status: 200,
          result: RelationEntity,
          page: {
            total,
            curPage,
            pageSize
          }
        })
      } else {
        res.json({
          status: '0',
          msg: '没有RelationEntity',
          result: ''
        })
      }
    })
})

// 获取数据实体详情
router.post('/getRelationEntityDetail', (req, res, next) => {
  const { id } = req.body

  RelationEntity.findOne({ id })
    .then((result) => {
      if (result) {
        console.log(result)
        let keys = ['id', 'code', 'state', 'nameEn', 'name', 'descriptEn', 'descript', 'parentId', 'storeType', 'modelType', 'inherit', 'tableName', 'version', 'creater', 'creatTime', 'modifier', 'modifyTime']
        let data = $filterObj(result, keys)
        res.json({
          status: 200,
          msg: '',
          result: data
        })
      } else {
        res.json({
          status: '0',
          msg: '没有RelationEntity',
          result: ''
        })
      }
    })
})

// 创建数据实体
router.post('/createRelationEntity', async (req, res, next) => {
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
  let result = await RelationEntity.findOne({ nameEn })
  if (result) {
    return res.status(200).json({
      status: '0',
      msg: '产品已存在',
      result: ''
    });
  } else {
    let newRelationEntity = {
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

    let RelationEntityEntity = new RelationEntity(newRelationEntity)
    RelationEntityEntity.save(err => {
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
router.put('/updateRelationEntity', (req, res, next) => {
  let keys = ['id', 'nameEn', 'name', 'descriptEn', 'descript', 'parentId', 'storeType', 'modelType', 'inherit', 'tableName']
  let params = $filterObj(req.body, keys)
  RelationEntity.updateOne({ id: params.id }, params, (err, result) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      RelationEntity.findOne({ id: params.id })
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
router.delete('/deleteRelationEntity', (req, res, next) => {
  const arr = req.body;
  RelationEntity.remove({
    _id: {
      $in: arr
    }
  }).then((RelationEntity) => {
    if (RelationEntity) {
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
router.get('/getRelationEntityBaseAttrList', (req, res, next) => {
  RelationEntity.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((RelationEntity) => {
      if (RelationEntity.length) {
        res.json({
          status: 200,
          msg: '',
          result: RelationEntity
        })
      } else {
        res.json({
          status: '0',
          msg: '没有RelationEntity',
          result: ''
        })
      }
    })
})

// 数据实体基本属性详情查询
router.get('/getRelationEntityBaseAttrDetail:id', (req, res, next) => {
  const { id } = req.params;
  RelationEntity.find({
    id
  })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((RelationEntity) => {
      if (RelationEntity) {
        res.json({
          status: 200,
          msg: '',
          result: RelationEntity
        })
      } else {
        res.json({
          status: '0',
          msg: '没有RelationEntity',
          result: ''
        })
      }
    })
})

// 数据实体基本属性创建
router.post('/createRelationEntityBaseAttr', (req, res, next) => {
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
  RelationEntity.findOne({ nameEn }).then((result) => {
    if (result) {
      return res.status(200).json({
        status: '0',
        msg: '产品已存在',
        result: ''
      });
    } else {
      let newRelationEntity = {
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

      let RelationEntityEntity = new RelationEntity(newRelationEntity)
      RelationEntityEntity.save(err => {
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
router.put('/updateRelationEntityBaseAttr', (req, res, next) => {
  const { id } = req.params;
  RelationEntity.updateOne({
    id
  }, req.body, (err, RelationEntity) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).send(RelationEntity);
    }
  })
})

// 数据实体基本属性删除
router.delete('/updateRelationEntityBaseAttrDelete', (req, res, next) => {
  const { id } = req.params;
  RelationEntity.deleteOne({
    _id: id
  }).then((RelationEntity) => {
    if (RelationEntity) {
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
router.get('/getRelationEntityExtendAttrList', (req, res, next) => {
  RelationEntity.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((RelationEntity) => {
      if (RelationEntity.length) {
        res.json({
          status: 200,
          msg: '',
          result: RelationEntity
        })
      } else {
        res.json({
          status: '0',
          msg: '没有RelationEntity',
          result: ''
        })
      }
    })
})

// 数据实体基本属性详情查询
router.get('/getRelationEntityBaseAttrDetail:id', (req, res, next) => {
  const { id } = req.params;
  RelationEntity.find({
    id
  })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((RelationEntity) => {
      if (RelationEntity) {
        res.json({
          status: 200,
          msg: '',
          result: RelationEntity
        })
      } else {
        res.json({
          status: '0',
          msg: '没有RelationEntity',
          result: ''
        })
      }
    })
})

// 数据实体基本属性创建
router.post('/createRelationEntityExtendAttr', (req, res, next) => {
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
  RelationEntity.findOne({ nameEn }).then((result) => {
    if (result) {
      return res.status(200).json({
        status: '0',
        msg: '产品已存在',
        result: ''
      });
    } else {
      let newRelationEntity = {
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

      let RelationEntityEntity = new RelationEntity(newRelationEntity)
      RelationEntityEntity.save(err => {
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
router.put('/updateRelationEntityExtendAttr', (req, res, next) => {
  const { id } = req.params;
  RelationEntity.updateOne({
    id
  }, req.body, (err, RelationEntity) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).send(RelationEntity);
    }
  })
})

// 数据实体基本属性删除
router.delete('/updateRelationEntityExtendAttrDelete', (req, res, next) => {
  const { id } = req.params;
  RelationEntity.deleteOne({
    _id: id
  }).then((RelationEntity) => {
    if (RelationEntity) {
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
router.get('/getRelationEntityParentAttrList', (req, res, next) => {
  RelationEntity.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((RelationEntity) => {
      if (RelationEntity.length) {
        res.json({
          status: 200,
          msg: '',
          result: RelationEntity
        })
      } else {
        res.json({
          status: '0',
          msg: '没有RelationEntity',
          result: ''
        })
      }
    })
})

// 数据实体父模型属性详情查询
router.get('/getRelationEntityParentAttrDetail:id', (req, res, next) => {
  const { id } = req.params;
  RelationEntity.find({
    id
  })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((RelationEntity) => {
      if (RelationEntity) {
        res.json({
          status: 200,
          msg: '',
          result: RelationEntity
        })
      } else {
        res.json({
          status: '0',
          msg: '没有RelationEntity',
          result: ''
        })
      }
    })
})
module.exports = router