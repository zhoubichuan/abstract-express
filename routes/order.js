var express = require('express')
var router = express.Router()

var OrderType = require('../app/models/orderType')
var Order = require('../app/models/order')

//查询订单类型
router.get('/type',(req,res,next) => {
    OrderType.find({})
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

router.get('/',(req,res,next) => {
	Order.find({})
		.populate('sales', 'account')
		.populate('client', 'clientName')
		.populate('clientType', 'clientType')
		.populate('product', 'productGroup productName productNum productPrice')
		.populate('followUpType')
		.sort({'_id':1})
		.limit(10)
		.exec()
		.then((order) => {
			if (order) {
				res.json({
					status: '1',
					msg: '',
					result: order
				})
			} else {
				res.json({
					status: '0',
					msg: '订单不存在',
					result: ''
				})
			}
		})
})

//根据typeID查询
router.get('/type/:id',(req,res,next) => {
	const _id = `${req.params.id}`;
	console.log('typeId  ' + _id)
	OrderType.findById({_id})
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

router.get('/:id',(req,res,next) => {
	const _id = `${req.params.id}`;
	console.log('orderId  ' + _id)
	Order.findById({_id})
		.exec(function (err, order) {   
			if (err) {   
			  return res.status(400).send({   
				message: '类型不存在',   
				result: {}   
			  });   
			} else {
			  res.jsonp({   
				result: order   
			  })  
			}
	})
})

//根据 id 更新数据
router.post('/type/update/:id',(req,res,next) => {
	var _id = `${req.params.id}`;
	OrderType.updateOne({ _id }, req.body, (err, type) => {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			res.status(200).send(type);
		}
	})
})

router.post('/update/:id',(req,res,next) => {
	var _id = `${req.params.id}`;
	Order.updateOne({ _id }, req.body, (err, order) => {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			res.status(200).send(order);
		}
	})
})


//新增类型
router.post('/type/add',(req,res,next) => {
	const orderType = req.body.orderType;
	const orderTypeDes = req.body.orderTypeDes;
	console.log('orderType   ' + orderType)
    OrderType.findOne({orderType:req.body.orderType}).then((type)　=> {
        if(type){
            return res.status(400).json(
				{
					status: '0',
					msg: '客户类型已存在',
					result: ''
				}
			);
        }else{
            let newOrderType = {
				orderType,
				orderTypeDes
            };

            let typeEntity = new OrderType(newOrderType)
            typeEntity.save(err => {
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

router.post('/add',(req,res,next) => {
	const contractNo = req.body.contractNo,
		  sales = req.body.salesId,
		  client = req.body.clientNameId,
		  clientType = req.body.clientTypeId,
		  orderDate = req.body.orderDate,
		  purchasing = req.body.purchasing,
		  product = req.body.productId,
		  receivables = req.body.receivables,
		  billingDate = req.body.billingDate,
		  actuallyArrived = req.body.actuallyArrived,
		  paymentDate = req.body.paymentDate,
		  production = req.body.production,
		  followUpType = req.body.followUpTypeId,
		  shipDate = req.body.shipDate,
		  arrivalDate = req.body.arrivalDate,
		  waybillNumber = req.body.waybillNumber,
		  shipping = req.body.shipping,
		  courierCompany = req.body.courierCompany;

		  console.log('client  ' + client)
	    Order.findOne({contractNo:req.body.contractNo}).then((order)　=> {
        if(order){
            return res.status(400).json(
				{
					status: '0',
					msg: '订单已存在',
					result: ''
				}
			);
        }else{
            let newOrder = {
				contractNo,
				sales,
				client,
				clientType,
				orderDate,
				purchasing,
				product,
				receivables,
				billingDate,
				actuallyArrived,
				paymentDate,
				production,
				followUpType,
				shipDate,
				arrivalDate,
				waybillNumber,
				shipping,
				courierCompany
            };

			console.log('newOrder   ' + JSON.stringify(newOrder))
			let orderEntity = new Order(newOrder)
			
            orderEntity.save(err => {
                if (err) {
                    res.json({
                        status: '0',
                        msg: err.message,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: '订单创建成功',
                        result: ''
                    })
                }
            })
        }
    })
})



//删除
router.delete('/type/del/:id',(req,res,next) => {
	const id = `${req.params.id}`;
	OrderType.deleteOne({ _id: id }).then((type) => {
		console.log(type)
		if(order){
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

router.delete('/del/:id',(req,res,next) => {
	const id = `${req.params.id}`;
	Order.deleteOne({ _id: id }).then((order) => {
		console.log(order)
		if(order){
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

router.get('/type/total',(req,res,next) => {
	OrderType.find({})
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




module.exports = router