

app.controller("registerController",['$scope','$http',function($scope, $http){

	$scope.user = {
		username: "",
		password: ""
	};
	$scope.error_message = "";

	$scope.register = function(){
		$http.post('/auth/register',$scope.user).success(function(data){
			console.log(data);
			if(data.status == 'success'){
				//$location.path('/login');
				$scope.error_message = data.message;
			}else{
				$scope.error_message = data.message;
			}
		}).error(function(data){
			console.log(data);
			$scope.error_message = data.message;
		});
	}
}]);