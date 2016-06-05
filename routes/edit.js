var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require('path');
var multipart=require("connect-multiparty");
var multipartMiddleware=multipart();

/* GET edit page. */
router.get('/', function(req, res, next) {
	var user=req.session.user;
	res.render('edit', {});
});
router.post('/render',function(req,res){
	res.contentType=("json");
	var user=dbHandel.getModel('user');
	var work=dbHandel.getModel('work');
	work.findOne({_id:req.body.worktype},function(err,doc){
		if(err){
			console.log('err'+req.body.worktype);
		}else if(doc){
			res.send(JSON.stringify({code:200,info:doc,user:req.session.user}));
		}
	})
});
router.post('/logout',function(req,res){
	req.session.destroy();
	res.send(JSON.stringify({code:200}))
})
router.post('/save',function(req,res){
	var user=dbHandel.getModel('user');
	var work=dbHandel.getModel('work');
	work.update({ "_id":req.session.workid }, { title: req.body.title ,page:req.body.pages,cover: req.body.cover ,content:req.body.editinfo,music:req.body.music},function(){
		res.send(JSON.stringify({code:200,user:req.session.userid,work:req.session.workid}));
	});
});
router.post('/init',function(req,res){
	var user=dbHandel.getModel('user');
	var pictureLib=dbHandel.getModel('pictureLib');
	req.session.workid=req.body.work;
	pictureLib.find({owner:req.session.userid},function(err,doc){
		if(err){
		}else if(doc){
			doc.reverse();
			var picinfo=doc;
			res.send(JSON.stringify({code:200,info:picinfo}));
		}
	})
});
router.post('/musicinfo',function(req,res){
	var user=dbHandel.getModel('user');
	var musicLib=dbHandel.getModel('musicLib');
	musicLib.find({owner:req.session.userid},function(err,doc){
		if(err){
		}else if(doc){
			doc.reverse();
			var musicinfo=doc;
			res.send(JSON.stringify({code:200,info:musicinfo}));
		}
	})
});
router.post('/delepic',function(req,res){
	var user=dbHandel.getModel('user');
	var pictureLib=dbHandel.getModel('pictureLib');
	console.log(req.body.picid);
	pictureLib.remove({_id:req.body.picid},function(err,doc){
		if(!err){
			pictureLib.find({owner:req.session.userid},function(err,doc){
				if(err){
				}else if(doc){
					doc.reverse();
					res.send(JSON.stringify({code:200,info:doc}));
				}
			})
		}
	});
});
router.post('/upload',multipartMiddleware,function(req,res){
	var user=dbHandel.getModel('user');
	var pictureLib=dbHandel.getModel('pictureLib');
	var type = req.files.file.type;
	var size = req.files.file.size;
	var maxSize = 800 * 1024*100;     //800K
	type = type.split("/")[1];
	if (type != "jpeg" && type != "jpg" && type != "png" &&type!="gif"&&type!="mp3") {
		res.send(JSON.stringify({code:201,"errMsg": "请上传png、jpg、jpeg,gif格式照片"}));
		return;
	} else if (size > maxSize) {
		res.send(JSON.stringify({code:202,"errMsg": "图片大小不要超过800K"}));
		return;
	} else if (type == "jpeg" || type == "jpg" || type=='mp3' || type == "png" ||type == "gif"&& size < maxSize) {
		fs.readFile(req.files.file.path, function (err, data) {
			if (err) {
			res.send(JSON.stringify({code:203,"errMsg": "'图片上传失败'"}));
	    }
	    var date=new Date();
	    var base64str = new Buffer(data).toString('base64'); //图片转字节
	    var picurl="/uploadpic/" +date.getTime()+date.getMilliseconds()+"."+type;
	    fs.writeFileSync("public"+picurl, base64str, 'base64');  //写入本地
	    // res.send("<input type='image' src='/uploadpic/upload."+type+"'/>");
		pictureLib.create({owner:req.session.userid,urlname:picurl});
	    res.send(JSON.stringify({code:200}));
	  });
	}
});
router.post('/uploadmusic',multipartMiddleware,function(req,res){
	var user=dbHandel.getModel('user');
	var musicLib=dbHandel.getModel('musicLib');
	var type = req.files.file.type;
	var size = req.files.file.size;
	var name = req.files.file.name;
	var maxSize = 800 * 1024*100*100;     //80000K
	type = type.split("/")[1];
	if (type!="mp3") {
		res.send(JSON.stringify({code:201,"errMsg": "请上传mp3格式照片"}));
		return;
	} else if (size > maxSize) {
		res.send(JSON.stringify({code:202,"errMsg": "图片大小不要超过80000K"}));
		return;
	} else if (type=='mp3'&& size < maxSize) {
		fs.readFile(req.files.file.path, function (err, data) {
			if (err) {
			res.send(JSON.stringify({code:203,"errMsg": "'音乐上传失败'"}));
	    }
	    var date=new Date();
	    var base64str = new Buffer(data).toString('base64'); //音乐转字节
	    var musicurl="/uploadmusic/" +date.getTime()+date.getMilliseconds()+"."+type;
	    fs.writeFileSync("public"+musicurl, base64str, 'base64');  //写入本地
	    // res.send("<input type='image' src='/uploadpic/upload."+type+"'/>");
		musicLib.create({owner:req.session.userid,filename:name,urlname:musicurl});
	    res.send(JSON.stringify({code:200}));
	  });
	}
});
module.exports = router;
