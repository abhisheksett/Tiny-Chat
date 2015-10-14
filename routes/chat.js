

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Chat = mongoose.model("Chat");

router.route('/all').get(function(req, res){
	console.log('All:'+req.query.from+","+req.query.to);
	var query = '';
	if(req.query.to == 'group'){
		query = Chat.find().where({to:req.query.to});
	}else{
		query = Chat.find().or([
			{$and: [{to: req.query.to},{from: req.query.from}]},
			{$and: [{to: req.query.from},{from: req.query.to}]}
		]);
	}
	query.limit(50)
	.exec(function(err, data){
		console.log(data);
		if(err){
			res.send(500, {status: "failure", message: "Internal Error"});
		}else if(res){
			res.send(200, {status: "success", message: "Data found", data: data});
		}else{
			console.log(data);
			res.send(200,{status: "success", message: "success", user: data});
		}
	});
}).post(function(req, res){
	var chat = Chat();
	chat.text = req.body.text;
	chat.from = req.body.from;
	chat.to = req.body.to;
	chat.created_at = req.body.created_at;
	chat.save(function(err, data){
		console.log(data);
		if(err){
			res.send(500, {status: "failure", message: "Internal Error"});
		}else if(data){
			res.send(200, {status: "success", message: "Message Saved", data: data});
		}
	})
}).delete(function(req, res){
	Chat.remove({}, function(err, data){
		if(!err){
			res.send(200, {status: "success", message: "Deleted All!"});
		}
	})
});

module.exports = router;