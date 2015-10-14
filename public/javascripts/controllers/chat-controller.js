

app.controller("chatController",['$scope','$http','$location', '$rootScope','$compile',
	function($scope, $http,$location,$rootScope,$compile){
	$scope.user = {
		username: "",
		password: ""
	};
	$scope.error_message = "";
	$scope.chatText = "";
	$scope.messageQueue = [];
	$scope.toUser = '';

$scope.send = function(){
	
	if($scope.toUser){
		if($scope.chatText.trim()){
		$("#container").append($scope.createMyChat($scope.chatText, Date.now()));
		var typeText = $scope.chatText;
		$scope.chatText = "";
		//server.emit('message',val);
		$('.chat-messages').animate({scrollTop: $('#container').height()},10);
		var data = {
			from: $rootScope.current_user,
			to: $scope.toUser,
			text: typeText,
			created_at: Date.now()
		};
		$scope.server.emit('message', data);
		$http.post('/chat/all',data).success(function(data){
			console.log(data);
		}).error(function(data){
			console.log(data);
		});
		}
	}else{
		alert('Please select user from left panel');
	}
};

$scope.recievedMessage = function(data){
	console.log(data);
	if(data.from == $scope.toUser){
		$scope.$apply(function(){
			$("#container").append($scope.createOtherChat(data.text, data.from,data.created_at));
		});
		
		$scope.chatText = "";
		$('.chat-display').animate({scrollTop: $('#container').height()},10);
	}else{
		$scope.updateBadge(data.from, true);
	}
},

$scope.createMyChat = function(text, time){
	var newElement = $compile("<my-chat time="+time+" text='"+text+"'></my-chat>")($scope);
	return newElement;
},

$scope.createOtherChat = function(text, from, time){
	var newElement = $compile("<other-chat time="+time+" text='"+text+"' from='"+from+"'></my-chat>")($scope);
	return newElement;
},

$scope.init = function(){

		$scope.server = io.connect('http://192.168.1.10:3000');
		$scope.server.on('newUser',$scope.newUser);
		$scope.server.emit('join', {username: $rootScope.current_user});
		$scope.server.on('message',$scope.recievedMessage);
		$rootScope.server = $scope.server;
		//$scope.loadChatData();

		//get all registered user
		$http.get('/auth/all/'+$rootScope.current_user).success(function(data){
			console.log(data);
			if(data.status == 'success'){
				$scope.allUsers = data.data;
				for(var i=0; i<$scope.allUsers.length; i++){
					$scope.allUsers[i].availability = false;
					$scope.allUsers[i].unreadMessageCount = 0;
				}
				$scope.allUsers.push({username:'group', availability: false, unreadMessageCount:0});
			}
		}).error(function(data){
			console.log(data);
		});
},

$scope.connectedUserInfo = function(data){
	console.log(data);
},

$scope.newUser = function(data){
	console.log(data);
	if(data.connectedUsers){
		for(var i=0; i<$scope.allUsers.length; i++){
			if($scope.allUsers[i].username != 'group'){
				if(data.connectedUsers.indexOf($scope.allUsers[i].username) != -1){
					$scope.allUsers[i].availability = true;
				}else{
					$scope.allUsers[i].availability = false;
				}
			}else{
				$scope.allUsers[i].availability = true;
			}
		}
		$scope.$apply();
	}
},

$scope.loadChatData = function(toUser){
	$scope.toUser = toUser;
	$scope.updateBadge(toUser, false);
	$("#container").empty();
	var getUrl = '/chat/all?from='+$rootScope.current_user+'&to='+$scope.toUser;
	//get all chat data for 'group'
	$http.get(getUrl).success(function(data){
		console.log(data);
		if(data.data.length>0){
			for(var i=0; i<data.data.length; i++){
				if(data.data[i].from == $rootScope.current_user){
					$("#container").append($scope.createMyChat(data.data[i].text, data.data[i].created_at));
				}else{
					$("#container").append($scope.createOtherChat(data.data[i].text,
					 data.data[i].from, data.data[i].created_at));
				}
			}
			$('.chat-messages').animate({scrollTop: $('#container').height()},10);
		}
	}).error(function(data){
		console.log(data);
	});
},

$scope.updateBadge = function(from, isIncrease){
	for(var i=0; i<$scope.allUsers.length; i++){
		if($scope.allUsers[i].username == from){
			if(isIncrease){
				$scope.allUsers[i].unreadMessageCount++;
			}else{
				$scope.allUsers[i].unreadMessageCount = 0;
			}
			break;
		}
	}
	//apply only when digest or apply not in progress
	if(!$scope.$$phase) {
  		//$digest or $apply
  		$scope.$apply();
	}
	
}

}]);