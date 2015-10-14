
var app = angular.module("chatApp",[]);

app.config(function($routeProvider){
	$routeProvider.when("/login",{
		templateUrl: "templates/login.html",
		controller: "loginController"
	}).when("/register",{
		templateUrl: "templates/register.html",
		controller: "registerController"
	}).when("/chat",{
		templateUrl: "templates/chat.html",
		controller: "chatController"
	}).otherwise({
		redirectTo: '/login'
	});
}).run(function($rootScope, $location){
	if(sessionStorage.getItem('user')){
		$rootScope.isAuthenticated = true;
		$rootScope.current_user = sessionStorage.getItem('user');
	}else{
		$rootScope.isAuthenticated = false;
		$rootScope.current_user = "";
	}

	$rootScope.signOut = function(event){
		event.preventDefault();
		$rootScope.server.emit('logout',{username: $rootScope.current_user});
		$rootScope.isAuthenticated = false;
		$rootScope.current_user = "";
		sessionStorage.removeItem('user');
		$location.path('/login');
	}

	$rootScope.$on("$routeChangeStart", function(event, next, current) {
		if(next.templateUrl == "templates/chat.html"){
			if(!window.sessionStorage.getItem('user')){
				$location.path('/login');
			}
		}
	});
	
}).directive('myChat', function($compile){
	return{
		restrict: 'EA',
		template: '<div id="mine_parent"><div id="mine" class="common-chat my-chat pull-right">'+
		'<span><b>Me:</b>{{text}}</span>'+
		'<br/><small class="lightText">{{time | date:"h:mma \'on\' MMM d, y"}}</small></div>'+
		'<div class="containerdivNewLine"></div></div>',
		scope: {
			time: '@time',
			text: '@text'
		},
		link: function(){

		},
		controller: function($scope, $attrs, $log) {
        	//$scope.text = $scope.$parent.chatText;
      	},
	};
}).directive('otherChat', function($compile){
	return{
		restrict: 'EA',
		template: '<div id="other_parent">'+
		'<div id="other" class="common-chat other-chat pull-left"><span><b>{{from}}:</b>{{message}}</span>'+
		'<br/><small class="lightText">{{time | date:"h:mma \'on\' MMM d, y"}}</small>'+
		'</div><div class="containerdivNewLine"></div>'+
		'</div>',
		scope: {
			time: '@time',
			from: '@from',
			message: '@text'
		},
		link: function(){

		},
		controller: function($scope, $attrs, $log) {
        	//$scope.text = $scope.$parent.chatText;
      	},
	};
});