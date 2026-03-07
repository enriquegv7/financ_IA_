angular.module('financialHubApp')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        redirectTo: '/mercado-espanol'
    })
    .when('/mercado-espanol', {
        template: '<screener-component></screener-component>'
    })
    .when('/mercado-espanol/screener', {
        template: '<screener-component></screener-component>'
    })
    .when('/mercado-espanol/estadisticas', {
        template: '<estadisticas-component></estadisticas-component>'
    })
    .when('/mercado-espanol/pizarra-andres', {
        template: '<pizarra-component></pizarra-component>'
    })
    .when('/global', {
        template: '<global-component></global-component>'
    })
    .when('/login', {
        template: '<login-component></login-component>'
    })
    .when('/feedback', {
        template: '<div class="page-placeholder"><h2>Feedback</h2><p>Página en construcción</p></div>'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);
