var app;

app = angular.module('app');

app.config(function($stateProvider, $urlRouterProvider) {
  return $urlRouterProvider.otherwise("/index");
});

app = angular.module('app');

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/index");
  return $stateProvider.state('index', {
    url: '/index',
    templateUrl: 'components/home/home.html',
    controller: 'HomeController'
  });
});

app.controller('HomeController', function($scope) {
  return $scope.text = 'Hello World';
});
