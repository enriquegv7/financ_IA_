/**
 * Módulo principal de la aplicación.
 *
 * Aquí se registra el interceptor HTTP (AuthInterceptor) que inyecta
 * el JWT en cada petición y gestiona los 401.
 */
angular.module('financialHubApp', ['ngRoute'])

.constant('API_BASE_URL', 'http://localhost:8000/api')

.config(['$locationProvider', '$httpProvider', function($locationProvider, $httpProvider) {
    $locationProvider.hashPrefix('');

    // Registrar el interceptor de autenticación
    // (definido en auth.service.js como factory 'AuthInterceptor')
    $httpProvider.interceptors.push('AuthInterceptor');
}]);
