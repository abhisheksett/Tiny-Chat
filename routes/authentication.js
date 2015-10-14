
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');
var User = mongoose.model("User");

router.route('/login').post(function(req, res){
	//console.log('Login:'+req.body.username+","+hashPassword);
	User.findOne()
	.where({username:req.body.username})
	.exec(function(err, user){
		console.log(user);
		if(err){
			res.send(500, {status: "failure", message: "Internal Error"});
		}else if(!user){
			res.send(200, {status: "failure", message: "No such user found!"});
		}else if(user && !isValidPassword(user, req.body.password)){
			res.send(200, {status: "failure", message: "Invalid username or password"});
		}else{
			console.log(user);
			res.send(200,{status: "success", message: "success", user: user});
		}
	});
});

router.route('/register').post(function(req, res){
	var hashPassword = createHash(req.body.password);
	User.findOne()
	.where({username: req.body.username})
	.exec(function(err, user){
		if(err){
			res.send(500, {status: "failure", message: "Internal Error"});
		}else if(user){
			res.send(200, {status: "failure", message: "User already exists"});
		}else{
			var newUser = User();
			newUser.username = req.body.username;
			newUser.password = hashPassword;
			newUser.save(function(err, userResponse){
				if(err){
					res.send(500, {status: "failure", message: "Internal Error"});
				}else if(!userResponse){
					res.send(500, {status: "failure", message: "Not able to register user !!"});
				}else{
					res.send(200,{status: "success", message: "success", message:"User registered successfully", user: userResponse});
				}
			});
		}
	});
});

router.route('/delete/:id').post(function(req, res){
	User.remove({_id:req.params.id}, function(err){
		if(!err){
			res.send(200,{status: "success", message: "Deleted"});
		}
	})
});

router.route('/all/:currentUser').get(function(req, res){
	User.find()
	.select('username')
	.where('username').ne(req.params.currentUser)
	.exec(function(err, data){
		if(err){
			res.send(500, {status: "failure", message: "Internal Error"});
		}else if(data){
			res.send(200, {status: "success", message: "data found", data: data});
		}
	});
});

var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
};

module.exports = router;