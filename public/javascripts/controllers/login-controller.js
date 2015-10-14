
app.controller("loginController",['$scope','$http','$location', '$rootScope',
	function($scope, $http,$location,$rootScope){
	$scope.user = {
		username: "",
		password: ""
	};
	$scope.error_message = "";

	$scope.login = function(){
		//$scope.user.password = bcrypt.hashSync($scope.user.password, bCrypt.genSaltSync(10), null);
		$http.post('/auth/login',$scope.user).success(function(data){
			console.log(data);
			if(data.status == 'success'){
				$rootScope.current_user = data.user.username;
				sessionStorage.setItem('user',$rootScope.current_user);
				$rootScope.isAuthenticated = true;
				$location.path('/chat');
			}else{
				$scope.error_message = data.message;
			}
		}).error(function(data){
			console.log(data);
			$scope.error_message = data.message;
		});
	};
}]);