var express = require('express')
var router = express.Router()
var Pay = require('./../app/models/pay')

router.get('/',(req,res,next) => {
    Pay.find({})
		.sort({'_id':-1})
		.limit(10)
		.exec()
		.then((pays) => {
			if (pays) {
				res.json({
					status: '1',
					msg: '',
					result: pays
				})
			} else {
				res.json({
					status: '0',
					msg: '帐户不存在',
					result: ''
				})
			}
		})
})

//根据ID查询
router.get('/:id',(req,res,next) => {
	const id = `${req.params.id}`;
	console.log('payID  ' + id)
	Pay.findById({ _id:id })
		.populate('payName')
		.exec(function (err, pay) {   
			if (err) {   
			  return res.status(400).send({   
				message: '不存在',   
				result: {}   
			  });   
			} else {
			  res.jsonp({   
				result: pay   
			  })  
			}
	})
})
// 添加付款方式
router.post('/add', (req, res, next) => {
	var paymentAccount = req.body.paymentAccount,
	    paymentName = req.body.paymentName;


		Pay.findOne({ paymentName: req.body.paymentName }).then((pay) => {
        if (pay) {
			return res.status(400).json(
				{
					status: '0',
					msg: '帐户已存在',
					result: ''
				}
			);
        }else {
			let newPay = {
				paymentAccount,
				paymentName
			}
			let payEntity = new Pay(newPay)
		
			payEntity.save((err) => {
				if (err) {
					res.json({
						status: '0',
						msg: err.message,
						result: ''
					})
				} else {
					res.json({
						status: '1',
						msg: '帐户创建成功',
						result: ''
					})
				}
			})
        }
    });
});

// 删除帐户
router.delete('/del/:id',  (req, res, next) => {
	const id = `${req.params.id}`;
	Pay.deleteOne({ _id: id }).then((pay) => {
		if(pay){
			res.status(200).json({
				status: '1',
				msg: '删除帐户成功',
				result: ''
			})
		}else{
			res.status(400).json({
				status: '0',
				msg: '用户不存在',
				result: ''
			})
		}
	})
})

//查询table 总数
router.get('/total',(req,res,next) => {
	Pay.find()
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
					msg: '没有帐户',
					total: 0
				})
			}
		})

})

//修改
router.post('/modify/:id',(req,res,next) => {
	const _id = `${req.params.id}`;
	Pay.updateOne({ _id }, req.body, (err, pay) => {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			res.status(200).send(pay);
		}
	})
})

module.exports = router