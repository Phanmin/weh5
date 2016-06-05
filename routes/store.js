var express = require('express');
var router = express.Router();
var docdata=null;
/* GET home page. */
router.get('/', function(req, res, next) {
	var user=req.session.user;
	res.render('store', {});
});
router.post("/useh5",function(req,res){
	var user=dbHandel.getModel('user');
	var work=dbHandel.getModel('work');
	if(req.session.user==undefined){
		res.send(JSON.stringify({code:400}));
	}
	work.findOne({'_id':req.body.workid},function(err,doc){
		if(doc){
			work.create({
				owner:req.session.userid,
				ownername:req.session.user,
				page:doc.page,
				content:doc.content,
				title:doc.title,
				cover:doc.cover,
				music:doc.music
			},function(err,doc){
				if(doc){
					res.send(JSON.stringify({code:200,userid:req.session.userid,workid:doc._id}));
				}else{
					res.end();
				}
			})
		}
		else{
			res.end();
		}
	})
})
router.post('/fetch',function(req,res){
	var result=[];
	var begincur;
	var endcur;
	var count=0;
	var finish=0;
	begincur=(req.body.pageid-1)*6;
	endcur=(req.body.pageid)*6;
	console.log(docdata.length)
	for(var i=begincur;i<endcur;i++){
		result.push(docdata[i]);
		count++;
		if(i==docdata.length-1){
			finish=1;
			break;
		} 
	}
	res.send(JSON.stringify({code:200,doc:result,finish:finish,count:count}));
})
router.post('/getdata',function(req,res){
	var work=dbHandel.getModel('work');
	work.find({draf:'0'},function(err,doc){
		if(doc){
			docdata=doc.reverse();
			res.send(JSON.stringify({code:200}));
		}
	})
})
module.exports = router;