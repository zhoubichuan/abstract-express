var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var multipartMiddleware = require('connect-multiparty')()
var { uploadImage } = require('./../middleware/uploadImage.js')
var { handleError } = require('./../public/util/handleError.js')
var { signRequired, adminRole } = require('./../middleware/auth.js')
var User = require('./../app/models/user')
var Info = require('./../app/models/info')
const jwt = require('jsonwebtoken');

//秘钥
var signkey = 'mes_qdhd_mobile';
//生成token
const setToken = function (username) {
	return new Promise((resolve, reject) => {
		const token = jwt.sign({
			username: username
		}, signkey, { expiresIn: 60 * 60 * 24 * 3 });
		// let info = jwt.verify(token.split(' ')[1], signkey)
		// console.log(info);
		console.log('token', token);
		resolve(token);
	})
}
// 查询所有用户信息
// router.get('/', signRequired, (req, res, next) => {
router.get('/', async (req, res, next) => {
	let data = await User.find({})
		.sort({ '_id': -1 })
		.limit(10)
		.populate('info')
		.exec()
	if (data) {
		res.json({
			status: '1',
			msg: '',
			result: data
		})
	} else {
		res.json({
			status: '0',
			msg: '没有用户',
			result: ''
		})
	}
})

//分页查询
router.get('/page/:page/size/:size', (req, res, next) => {
	const _page = `${req.params.page}`;
	const _size = `${req.params.size}`

	console.log("传的size为：   " + _size + "    page:   " + _page)
	var query = User.find();

	query.skip(_page * _size);
	query.limit(_size);
	query.sort({ '_id': -1 });
	query.populate('info');
	query.exec().then((users, total, index) => {
		if (users) {
			res.json({
				status: '1',
				msg: '',
				result: users,
				curPage: index
			})
		} else {
			res.json({
				status: '0',
				msg: '没有用户',
				result: ''
			})
		}
	})
})
//查询table 总数
router.get('/total', (req, res, next) => {
	User.find()
		.count()
		.then((total) => {
			console.log('total  ' + total)
			if (total > 0) {
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
//根据ID查询
router.get('/:id', (req, res, next) => {
	const _id = `${req.params.id}`;
	console.log('userId  ' + _id)
	User.findById({ _id })
		.populate('info')
		.exec((user) => {
			console.log(user)
			if (user) {
				res.status(200).json({
					status: '1',
					msg: '',
					result: user
				})
			} else {
				res.json({
					status: '0',
					msg: '用户不存在',
					result: ''
				})
			}
		})
})
// 添加用户
router.post('/add', (req, res, next) => {
	var account = req.body.account,
		password = req.body.password,
		avatar = req.body.avatar,
		job = req.body.job,
		address = req.body.address,
		tel = req.body.tel,
		email = req.body.email,
		username = req.body.username,
		role = req.body.role


	User.findOne({ account: req.body.account }).then((user) => {
		if (user) {
			return res.status(400).json(
				{
					status: '0',
					msg: '用户已存在',
					result: ''
				}
			);
		} else {
			let newInfo = {
				avatar,
				job,
				address,
				tel,
				email,
				username
			}
			let info = new Info(newInfo)

			info.save((err) => {
				if (err) {
					res.json({
						status: '0',
						msg: err.message,
						result: ''
					})
				} else {
					let newUser = {
						account: account,
						password: password,
						role,
						pwdKey: '',
						info: info._id
					}
					let user = new User(newUser)
					user.save(err => {
						if (err) {
							res.json({
								status: '0',
								msg: err.message,
								result: ''
							})
						} else {
							res.json({
								status: '1',
								msg: '用户创建成功',
								result: ''
							})
						}
					})
				}
			})
		}
	});
});

// 删除用户  signRequired, adminRole,
router.delete('/del/:id', (req, res, next) => {
	const id = `${req.params.id}`;
	User.deleteOne({ _id: id }).then((user) => {
		// console.log(user)
		if (user) {
			res.status(200).json({
				status: '1',
				msg: '删除用户成功',
				result: ''
			})
		} else {
			res.status(400).json({
				status: '0',
				msg: '用户不存在',
				result: ''
			})
		}
	})
})

// 修改用户权限  signRequired, adminRole,
router.post('/modify/role', (req, res, next) => {
	let role = req.body.role
	let id = req.body.id
	User.findOne({ _id: id }, (err, user) => {
		if (err) {
			res.json({
				status: '0',
				msg: err.message,
				result: ''
			})
		}
		if (user) {
			if (user.role >= 50) {
				res.json({
					status: '0',
					msg: '权限不够，不能修改',
					result: ''
				})
			} else {
				user.role = role
				user.save(err => {
					if (err) {
						res.json({
							status: '0',
							msg: err.message,
							result: ''
						})
					} else {
						res.json({
							status: '1',
							msg: '权限修改成功',
							result: ''
						})
					}
				})
			}
		} else {
			res.json({
				status: '0',
				msg: '用户不存在',
				result: ''
			})
		}
	})
})

// 最高权限修改密码 signRequired, adminRole,
router.post('/modify/psd', (req, res, next) => {
	let pwd = req.body.password
	let id = req.body.id
	let authorization = req.headers['authorization']
	User.findOne({ _id: id }, (err, user) => {
		if (user) {
			console.log(user)
			crypto.randomBytes(16, (err, buf) => {
				let salt = buf.toString('hex')
				user.pwdKey = salt
				crypto.pbkdf2(pwd, salt, 4096, 16, 'sha1', (err, secret) => {
					if (err) throw err
					user.password = secret.toString('hex')
					user.save(err => {
						if (err) {
							res.json({
								status: '0',
								msg: err.message,
								result: ''
							})
						} else {
							res.json({
								status: '1',
								msg: '修改密码成功',
								result: ''
							})
						}
					})
				})
			})
		} else {
			res.json({
				status: '0',
				msg: '用户不存在',
				result: ''
			})
		}
	})
})

// 登陆接口
/* JWT的身份验证：
使用基于 Token 的身份验证方法，在服务端不需要存储用户的登录记录。大概的流程是这样的：
1、客户端使用用户名跟密码请求登录
2、 服务端收到请求，去验证用户名与密码
3、验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
4、客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里
5、客户端每次向服务端请求资源的时候需要带着服务端签发的 Token
6、服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据
 */
router.post('/login', (req, res, next) => {
	var account = req.body.account,
		password = req.body.password;

	User.findOne({ 'account': account })
		.populate('info', 'username avatar')
		.exec()
		.then((user) => {
			if (user) {
				user.comparePwd(password, (err, isMatch) => {
					if (err) throw err
					if (isMatch == true) {
						req.session.user = user
						setToken(user).then(token =>
							res.json({
								status: '1',
								msg: '',
								result: {
									'token': token,
									'user': user,
									'sessionId': req.session.id
								}
							})
						)
					} else {
						res.json({
							status: '0',
							msg: 'password incorrect',
							result: ''
						})
					}
				})
			} else {
				res.json({
					status: '0',
					msg: '用户不存在',
					result: ''
				})
			}
		})
})

// 登出接口
router.get('/logout', (req, res, next) => {
	delete req.session.user
	res.json({
		status: '1',
		msg: '用户已登出',
		result: ''
	})
})

// 检测是否已经登陆
router.post('/checklogin', (req, res, next) => {
	let sessionId = req.body.sessionId
	let userId = req.session.user._id
	if (req.session.id === sessionId) {
		User.findOne({ _id: userId })
			.populate('info', 'username avatar')
			.exec()
			.then((user) => {
				if (user) {
					req.session.user = user
					res.json({
						status: '1',
						msg: '用户已登陆',
						result: user
					})
				} else {
					res.json({
						status: '0',
						msg: '用户不存在',
						result: ''
					})
				}
			})
	} else {
		res.json({
			status: '0',
			msg: '用户未登陆',
			result: ''
		})
	}
})

// 读取用户资料  signRequired, adminRole
router.get('/userInfo/:id', (req, res, next) => {
	var _id = `${req.params.id}`;
	console.log('get id    ' + _id);
	Info.findById({ _id })
		.exec((err, info) => {
			if (info) {
				res.json({
					status: '1',
					msg: '',
					result: info
				})
			} else {
				res.json({
					status: '0',
					msg: '用户不存在',
					result: ''
				})
			}
		})
})

// 上传用户资料  signRequired, multipartMiddleware, uploadImage,
router.post('/userInfo/:id', (req, res, next) => {
	var _id = `${req.params.id}`;
	console.log('post id  ' + _id)
	Info.findByIdAndUpdate({ _id }, req.body, (err, info) => {
		let infoId = _id
		let username = req.body.username
		let job = req.body.job
		let address = req.body.address
		let tel = req.body.tel
		let email = req.body.email
		let avatar = req.body.avatar

		if (avatar) {
			avatar = req.body.avatar
		}

		// 用于判断是否有新上传图片
		if (avatar !== '') {
			let oldPath = path.join(__dirname, '../', `/public/${avatar}`)
			// 删除之前的图片
			fs.unlink(oldPath, (err) => {
				if (err) {
					if (err.code === 'ENOENT') {
						console.error('myfile does not exist')
					}
					handleError(err)
				}
			})
		}

		const newInfo = new Info({
			infoId,
			username,
			job,
			address,
			tel,
			email,
			avatar
		})

		newInfo.save().then(info =>
			res.json({
				status: '1',
				msg: "修改成功",
				result: info
			})).catch(err => console.log(err));
	})
})

module.exports = router