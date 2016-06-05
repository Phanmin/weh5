var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var user=req.session.user;
	res.render('myh5', {});
});
router.post('/recallmyh5',function(req,res){
	var work=dbHandel.getModel('work');
	work.update({"_id":req.body.workid},{draf:'1'},function(){
		res.send(JSON.stringify({code:200}));
	})
})
router.post('/publishmyh5',function(req,res){
	var work=dbHandel.getModel('work');
	work.update({"_id":req.body.workid},{draf:'0'},function(){
		res.send(JSON.stringify({code:200}));
	})
})
router.post('/copymyh5',function(req,res){
	var work=dbHandel.getModel('work');
	work.findOne({"_id":req.body.workid},function(err,doc){
		if(doc){
			work.create({
				owner:req.session.userid,
				page:doc.page,
				content:doc.content,
				title:doc.title,
				cover:doc.cover,
				music:doc.music
			},function(err,doc){
				if(doc){
					res.send(JSON.stringify({code:200}));
				}
			})
		}
	})
})
router.post('/',function(req,res){
	var user=dbHandel.getModel('user');
	var work=dbHandel.getModel('work');
	switch(req.body.todo){
		case 'goedit':{
			work.create({
				owner:req.session.userid,
				ownername:req.session.user,
				page:1,
				content:'[{"background":"/images/test.png","content":""}]',
				title:'title',
				cover:'/images/test.png'
			},function(err,doc){
				if(err){
				}else if(doc){
					req.session.workid=doc._id
					res.send(JSON.stringify({code:200,userid:req.session.userid,workid:doc._id}));
				}
			});
			break;
		}
		case 'dele':{
			work.remove({_id:req.body.workid},function(err){
				if(err)
					console.log(err);
			});
			res.send(JSON.stringify({code:200}));
			break;
		}
		case 'load':{
			work.find({owner:req.session.userid},function(err,doc){
				if(err){
				}else if(doc){
					var info=[];
					var isfirst=false;
					var islast=false;
					doc.reverse();
					for(var i=(req.body.page-1)*7,a=0;i<doc.length;i++){
						a++;
						if(a>7){
							break;
						}
						info.push(doc[i]);
					}
					if(req.body.page==1){
						isfirst=true;
					}
					if(doc.length-(req.body.page-1)*7<=7){
						islast=true;
					}
					res.send(JSON.stringify({code:200,datainfo:info,isfirst:isfirst,islast:islast}));
				}
			})
			break;
		}
		default:{
			// process something
		}
	}
})
module.exports = router;