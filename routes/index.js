var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var user=req.session.user;
	res.render('index', {});
});
router.post('/',function(req,res){
	res.contentType('json');
	var user=global.dbHandel.getModel('user');
	switch(req.body.todo){
		case "regist":{
			var rusername=req.body.username;
			var rpassword=req.body.password;
			user.findOne({name:rusername},function(err,doc){
				if(err){
					res.send(JSON.stringify({ code:500,info:"网络异常错误" }));
				}else if(doc){
					res.send(JSON.stringify({ code:500,info:"用户名已存在" }))
				}else{
					user.create({
						name:rusername,
						password:rpassword
					},function(err,doc){
						if(err){
							res.send(JSON.stringify({ code:500,info:"网络异常错误" }))
						}else{
							res.send(JSON.stringify({ code:200,info:"注册成功，即将进入登录界面" }))
						}
					})
				}
			});
			break;
		}
		case "login":{
			var rusername=req.body.username;
			var rpassword=req.body.password;
			user.findOne({name:rusername},function(err,doc){
				if(err){
					res.send(JSON.stringify({ code:500,info:"网络异常错误" }));
				}else if(!doc){
					res.send(JSON.stringify({ code:500,info:"用户名不存在" }))
				}else{
					if(rpassword!=doc.password){
					res.send(JSON.stringify({ code:500,info:"用户名或密码错误" }))
					}else{
						req.session.user=rusername;
						req.session.userid=doc._id;
						res.send(JSON.stringify({code:200,username:req.session.user,info:"登陆成功,正在跳转..."}))
					}
				}
			});
			break;
		}
		case "init":{
			if(req.session.user==undefined){
				res.send(JSON.stringify({code:404}));
			}else{
				res.send(JSON.stringify({code:200,username:req.session.user}));
			}
			break;
		}
		case 'logout':{
			req.session.destroy();
			res.send(JSON.stringify({code:200}))
		}
		case 'gomyh5':{
			if(req.session.user==undefined){
				res.send(JSON.stringify({code:404}));
			}else{
				res.send(JSON.stringify({code:200,userid:req.session.userid}));
			}
			break;
		}
		default:{
			// I don't know what to process
		}
	}
});
module.exports = router;
