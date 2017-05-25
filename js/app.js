'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute','ngWebSocket'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

}]).factory('sckt', function ($websocket,$rootScope) {
    // Open a WebSocket connection
    //var ws = $websocket("ws://localhost:1337" + document.location.host +
       // document.location.pathname + "atpendpoint");
    var ws = $websocket("ws://46.101.190.180:1337");

    var received = null;
    ws.onMessage(function (event) {
        console.log('message: ', event.data);
        setTimeout(function () {
            received = event.data;
            //$rootScope.message = event.data;
            $rootScope.$broadcast('RETURN-VALUE',event.data);
        });
    });
    ws.onError(function (event) {
        console.log('connection Error', event);
    });
    ws.onClose(function (event) {
        console.log('connection closed', event);
    });
    ws.onOpen(function () {
        console.log('connection open');
        //ws.send('HELLO SERVER');
    });
    return {
        response: received,
        send: function (message) {
            if (angular.isString(message)) {
                ws.send(message);
            }
            else if (angular.isObject(message)) {
                ws.send(JSON.stringify(message));
            }
        }
    };
}).controller('mainCtrl', function ($scope,sckt) {

    $scope.socket = sckt;
    $scope.$on('RETURN-VALUE',function(event,data){
        console.log(data);
        $scope.message = data;
        document.getElementById('value').value = '';
        document.getElementById('value').value = data;
    });

    $scope.command = '';
    $scope.doIt = function () {
      if($scope.command!=='' || $scope.command !==undefined )
          sckt.send($scope.command);
    };
});
