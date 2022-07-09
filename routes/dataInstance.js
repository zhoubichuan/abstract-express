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

var DataInstance = require('./../app/models/dataInstance')
// 数据实体列表查询
router.post('/getDataInstanceList', async (req, res, next) => {
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

  const total = await DataInstance.find().count()
  DataInstance.find(conditions)
    .sort({
      '_id': -1
    })
    .skip(curPage)
    .limit(pageSize)
    .exec()
    .then((DataInstance) => {
      console.log(DataInstance)
      if (DataInstance.length) {
        res.json({
          status: 200,
          result: DataInstance,
          page: {
            total,
            curPage,
            pageSize
          }
        })
      } else {
        res.json({
          status: '0',
          msg: '没有DataInstance',
          result: ''
        })
      }
    })
})

// 获取数据实体详情
router.post('/getDataInstanceDetail', (req, res, next) => {
  const { id } = req.body

  DataInstance.findOne({ id })
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
          msg: '没有DataInstance',
          result: ''
        })
      }
    })
})

// 创建数据实体
router.post('/createDataInstance', async (req, res, next) => {
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
  let result = await DataInstance.findOne({ nameEn })
  if (result) {
    return res.status(200).json({
      status: '0',
      msg: '产品已存在',
      result: ''
    });
  } else {
    let newDataInstance = {
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

    let DataInstanceEntity = new DataInstance(newDataInstance)
    DataInstanceEntity.save(err => {
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
router.put('/updateDataInstance', (req, res, next) => {
  let keys = ['id', 'nameEn', 'name', 'descriptEn', 'descript', 'parentId', 'storeType', 'modelType', 'inherit', 'tableName']
  let params = $filterObj(req.body, keys)
  DataInstance.updateOne({ id: params.id }, params, (err, result) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      DataInstance.findOne({ id: params.id })
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
router.delete('/deleteDataInstance', (req, res, next) => {
  const arr = req.body;
  DataInstance.remove({
    _id: {
      $in: arr
    }
  }).then((DataInstance) => {
    if (DataInstance) {
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
router.get('/getDataInstanceBaseAttrList', (req, res, next) => {
  DataInstance.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((DataInstance) => {
      if (DataInstance.length) {
        res.json({
          status: 200,
          msg: '',
          result: DataInstance
        })
      } else {
        res.json({
          status: '0',
          msg: '没有DataInstance',
          result: ''
        })
      }
    })
})

// 数据实体基本属性详情查询
router.get('/getDataInstanceBaseAttrDetail:id', (req, res, next) => {
  const { id } = req.params;
  DataInstance.find({
    id
  })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((DataInstance) => {
      if (DataInstance) {
        res.json({
          status: 200,
          msg: '',
          result: DataInstance
        })
      } else {
        res.json({
          status: '0',
          msg: '没有DataInstance',
          result: ''
        })
      }
    })
})

// 数据实体基本属性创建
router.post('/createDataInstanceBaseAttr', (req, res, next) => {
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
  DataInstance.findOne({ nameEn }).then((result) => {
    if (result) {
      return res.status(200).json({
        status: '0',
        msg: '产品已存在',
        result: ''
      });
    } else {
      let newDataInstance = {
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

      let DataInstanceEntity = new DataInstance(newDataInstance)
      DataInstanceEntity.save(err => {
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
router.put('/updateDataInstanceBaseAttr', (req, res, next) => {
  const { id } = req.params;
  DataInstance.updateOne({
    id
  }, req.body, (err, DataInstance) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).send(DataInstance);
    }
  })
})

// 数据实体基本属性删除
router.delete('/updateDataInstanceBaseAttrDelete', (req, res, next) => {
  const { id } = req.params;
  DataInstance.deleteOne({
    _id: id
  }).then((DataInstance) => {
    if (DataInstance) {
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
router.get('/getDataInstanceExtendAttrList', (req, res, next) => {
  DataInstance.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((DataInstance) => {
      if (DataInstance.length) {
        res.json({
          status: 200,
          msg: '',
          result: DataInstance
        })
      } else {
        res.json({
          status: '0',
          msg: '没有DataInstance',
          result: ''
        })
      }
    })
})

// 数据实体基本属性详情查询
router.get('/getDataInstanceBaseAttrDetail:id', (req, res, next) => {
  const { id } = req.params;
  DataInstance.find({
    id
  })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((DataInstance) => {
      if (DataInstance) {
        res.json({
          status: 200,
          msg: '',
          result: DataInstance
        })
      } else {
        res.json({
          status: '0',
          msg: '没有DataInstance',
          result: ''
        })
      }
    })
})

// 数据实体基本属性创建
router.post('/createDataInstanceExtendAttr', (req, res, next) => {
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
  DataInstance.findOne({ nameEn }).then((result) => {
    if (result) {
      return res.status(200).json({
        status: '0',
        msg: '产品已存在',
        result: ''
      });
    } else {
      let newDataInstance = {
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

      let DataInstanceEntity = new DataInstance(newDataInstance)
      DataInstanceEntity.save(err => {
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
router.put('/updateDataInstanceExtendAttr', (req, res, next) => {
  const { id } = req.params;
  DataInstance.updateOne({
    id
  }, req.body, (err, DataInstance) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).send(DataInstance);
    }
  })
})

// 数据实体基本属性删除
router.delete('/updateDataInstanceExtendAttrDelete', (req, res, next) => {
  const { id } = req.params;
  DataInstance.deleteOne({
    _id: id
  }).then((DataInstance) => {
    if (DataInstance) {
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
router.get('/getDataInstanceParentAttrList', (req, res, next) => {
  DataInstance.find({})
    .sort({
      '_id': -1
    })
    .limit(20)
    .exec()
    .then((DataInstance) => {
      if (DataInstance.length) {
        res.json({
          status: 200,
          msg: '',
          result: DataInstance
        })
      } else {
        res.json({
          status: '0',
          msg: '没有DataInstance',
          result: ''
        })
      }
    })
})

// 数据实体父模型属性详情查询
router.get('/getDataInstanceParentAttrDetail:id', (req, res, next) => {
  const { id } = req.params;
  DataInstance.find({
    id
  })
    .sort({
      '_id': -1
    })
    .limit(10)
    .exec()
    .then((DataInstance) => {
      if (DataInstance) {
        res.json({
          status: 200,
          msg: '',
          result: DataInstance
        })
      } else {
        res.json({
          status: '0',
          msg: '没有DataInstance',
          result: ''
        })
      }
    })
})
module.exports = router