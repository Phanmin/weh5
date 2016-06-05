var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('show', {});
});
router.post('/',function(req,res){
	var work=dbHandel.getModel('work');
	switch(req.body.todo){
		case 'show':{
			work.findOne({_id:req.body.workid},function(err,doc){
				if(err){
					console.log('err');
					res.end();
				}else if(doc){
					res.send(JSON.stringify({code:200,info:doc
					}));
				}else{
					console.log('err');
					res.end();
				}
			})
		}
	}
})
module.exports = router;
