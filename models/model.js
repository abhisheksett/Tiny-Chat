
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String
});

var chatSchema = new mongoose.Schema({
	text: String,
	created_at: String,
	to: String,
	from: String
});

mongoose.model("User", userSchema);
mongoose.model("Chat", chatSchema);