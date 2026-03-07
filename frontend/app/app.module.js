angular.module('financialHubApp', ['ngRoute'])
.constant('API_BASE_URL', 'http://localhost:8000/api')
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
