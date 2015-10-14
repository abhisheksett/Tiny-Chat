app.directive('myChat', function(){
	return{
		restrict: 'EAMC',
		transclude: true,
		template: '<div id="mine_parent"><div id="mine" class="common-chat my-chat pull-right">'+
		'<span><b>Me:</b>{{text}}</span>'+
		'<br/><small class="lightText">{{time | date:"h:mma \'on\' MMM d, y"}}</small></div>'+
		'<div class="containerdivNewLine"></div></div>',
		scope: {},
		link: function(){

		},
		controller: function($scope, $attrs, $log) {
        	$scope.text = $parent.chatText;
      },
	}
});