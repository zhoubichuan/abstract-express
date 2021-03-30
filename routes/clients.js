var express = require('express')
var router = express.Router()

var Client = require('../app/models/client')
var ClientType = require('../app/models/clientType')
var Pay = require('../app/models/pay')

var { handleError } = require('../public/util/handleError')
var { signRequired, adminRole } = require('../middleware/auth.js')

router.use(signRequired)

//查询客户类型
router.get('/type',(req,res,next) => {
    ClientType.find({})
		.sort({'_id':1})
		.limit(10)
		.exec()
		.then((types) => {
			if (types) {
				res.json({
					status: '1',
					msg: '',
					result: types
				})
			} else {
				res.json({
					status: '0',
					msg: '类型不存在',
					result: ''
				})
			}
		})
})

//根据typeID查询
router.get('/type/:id',(req,res,next) => {
	const _id = `${req.params.id}`;
	console.log('typeId  ' + _id)
	ClientType.findById({_id})
		.populate('typeName','clientType')
		.exec(function (err, type) {   
			if (err) {   
			  return res.status(400).send({   
				message: '类型不存在',   
				result: {}   
			  });   
			} else {
			  res.jsonp({   
				result: type   
			  })  
			}
	})
})

//根据 id 更新数据
router.post('/type/update/:id',(req,res,next) => {
	var _id = `${req.params.id}`;
	ClientType.updateOne({ _id }, req.body, (err, pay) => {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			res.status(200).send(pay);
		}
	})
})


//新增类型
router.post('/type/add',(req,res,next) => {
    const clientType = req.body.clientType;

    ClientType.findOne({clientType:req.body.clientType}).then((type)　=> {
        if(type){
            return res.status(400).json(
				{
					status: '0',
					msg: '客户类型已存在',
					result: ''
				}
			);
        }else{
            let newClientType = {
                clientType
            };

            let clientTypeEntity = new ClientType(newClientType)
            clientTypeEntity.save(err => {
                if (err) {
                    res.json({
                        status: '0',
                        msg: err.message,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: '客户类型创建成功',
                        result: ''
                    })
                }
            })
        }
    })
})

//删除客户类型
router.delete('/type/del/:id',(req,res,next) => {
	const id = `${req.params.id}`;
	ClientType.deleteOne({ _id: id }).then((type) => {
		// console.log(user)
		console.log(type)
		if(type){
			res.status(200).json({
				status: '1',
				msg: '删除成功',
				result: ''
			})
		}else{
			res.status(400).json({
				status: '0',
				msg: '不存在',
				result: ''
			})
		}
	})
})










//查询客户
router.get('/', (req, res, next) => {
	Client.find({})
		.populate('typeName')
		.populate('payName')
		.sort({'_id':-1})
		.limit(10)
		.exec((err, clients) => {
			if (clients) {
				res.json({
					status: '1',
					msg: '',
					result: clients
				})
			} else {
				res.json({
					status: '0',
					msg: '客户不存在',
					result: ''
				})
			}
		})
})
//查询类型总数
router.get('/total',(req,res,next) => {
	Client.find()
		.count()
		.then((total) => {
			console.log('total  ' + total)
			if(total > 0){
				res.json({
					status: '1',
					msg: '',
					total: total
				})
			} else {
				res.json({
					status: '0',
					msg: '没有用户',
					total: 0
				})
			}
		})

})
//根据客户名称查询客户
router.get('/:name',(req,res,next) => {
    const name = req.params.name;
    Client.find({'clientName':name})
    .sort({'_id':-1})
    .limit(10)
    .exec()
    .then((client) => {
        if (client) {
            res.json({
                status: '1',
                msg: '',
                result: client
            })
        } else {
            res.json({
                status: '0',
                msg: '没有客户',
                result: ''
            })
        }
    })
})

//新增客户
router.post('/add',(req,res,next) => {
	console.log('add    ' + req.body)
    const clientName = req.body.clientName,
		  typeName = req.body.typeName,
          address = req.body.address,
          tel = req.body.tel,
          fax = req.body.fax,
          contactPerson = req.body.contactPerson,
		  contactTel = req.body.contactTel,
		  payName = req.body.payName;

    Client.findOne({clientName:req.body.clientName}).then((client)　=> {
        if(client){
            return res.status(400).json(
				{
					status: '0',
					msg: '客户已存在',
					result: ''
				}
			);
        }else{
            let newClient = {
                clientName,
                typeName,
                address,
                tel,
                fax,
                contactPerson,
				contactTel,
				payName
            };
			

            let clientEntity = new Client(newClient)
            clientEntity.save(err => {
                if (err) {
                    res.json({
                        status: '0',
                        msg: err.message,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: '客户创建成功',
                        result: ''
                    })
                }
            })
        }
    })
})

//删除客户
router.delete('/del/:id',(req,res,next) => {
    const id = `${req.params.id}`;
	Client.deleteOne({ _id: id }).then((client) => {
		// console.log(user)
		if(client){
			res.status(200).json({
				status: '1',
				msg: '删除成功',
				result: ''
			})
		}else{
			res.status(400).json({
				status: '0',
				msg: '不存在',
				result: ''
			})
		}
	})
})

module.exports = router