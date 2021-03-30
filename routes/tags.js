var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var multipartMiddleware = require('connect-multiparty')()
var { signRequired, adminRole } = require('../middleware/auth.js')

var Tag = require('./../app/models/tag')
router.use(signRequired)

//查询所有的 tags
router.get('/', (req, res, next) => {
	Tag.find({})
		.sort({'_id':-1})
		.limit(10)
		.exec()
		.then((tags) => {
			if (tags) {
				res.json({
					status: '1',
					msg: '',
					result: tags
				})
			} else {
				res.json({
					status: '0',
					msg: '没有tags',
					result: ''
				})
			}
		})
})

//根据type查询tag
router.get('/type/:number',(req,res,next) => {
    const num = req.params.num;
    Tag.find({'tagType':num})
    .sort({'_id':-1})
    .limit(10)
    .exec()
    .then((tags) => {
        if (tags) {
            res.json({
                status: '1',
                msg: '',
                result: tags
            })
        } else {
            res.json({
                status: '0',
                msg: '没有tags',
                result: ''
            })
        }
    })
})

//新增tag
router.post('/add',(req,res,next) => {
    const tagName = req.body.tagName,
          tagType = req.body.tagType;

    Tag.findOne({tagName:req.body.tagName}).then((tag)　=> {
        if(tag){
            return res.status(400).json(
				{
					status: '0',
					msg: '标签已存在',
					result: ''
				}
			);
        }else{
            let newTag = {
                tagName,
                tagType
            };

            let tagEntity = new Tag(newTag)
            tagEntity.save(err => {
                if (err) {
                    res.json({
                        status: '0',
                        msg: err.message,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: '标签创建成功',
                        result: ''
                    })
                }
            })
        }
    })
})

//删除tags
router.delete('/del/:id',(req,res,next) => {
    const id = `${req.params.id}`;
	Tag.deleteOne({ _id: id }).then((tag) => {
		// console.log(user)
		if(tag){
			res.status(200).json({
				status: '1',
				msg: '删除标签成功',
				result: ''
			})
		}else{
			res.status(400).json({
				status: '0',
				msg: '标签不存在',
				result: ''
			})
		}
	})
})

module.exports = router