/**
 * Configuración de rutas de la aplicación.
 *
 * Las rutas protegidas usan el objeto 'resolve' con AuthGuard para
 * redirigir automáticamente si el usuario no cumple los requisitos.
 *
 * Guards disponibles (definidos en auth.service.js):
 *   AuthGuard.requireAuth()  → cualquier usuario autenticado
 *   AuthGuard.requireAdmin() → solo admins
 *   AuthGuard.requirePaid()  → plan paid o admin
 */
angular.module('financialHubApp')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider

        // Raíz → redirige al mercado
        .when('/', {
            redirectTo: '/mercado-espanol'
        })

        // ------------------------------------------------------------------
        // Rutas protegidas (requireAuth)
        // ------------------------------------------------------------------

        .when('/mercado-espanol', {
            template: '<screener-component></screener-component>',
            resolve: {
                auth: ['AuthGuard', function(AuthGuard) {
                    return AuthGuard.requireAuth();
                }]
            }
        })
        .when('/mercado-espanol/estadisticas', {
            template: '<estadisticas-component></estadisticas-component>',
            resolve: {
                auth: ['AuthGuard', function(AuthGuard) {
                    return AuthGuard.requireAuth();
                }]
            }
        })
        .when('/mercado-espanol/pizarra-andres', {
            template: '<pizarra-component></pizarra-component>',
            resolve: {
                auth: ['AuthGuard', function(AuthGuard) {
                    return AuthGuard.requireAuth();
                }]
            }
        })
        .when('/global', {
            template: '<global-component></global-component>',
            resolve: {
                auth: ['AuthGuard', function(AuthGuard) {
                    return AuthGuard.requireAuth();
                }]
            }
        })

        // ------------------------------------------------------------------
        // Rutas públicas (login / registro)
        // ------------------------------------------------------------------

        .when('/login', {
            template: '<login-component></login-component>'
        })
        .when('/register', {
            template: '<register-component></register-component>'
        })

        // ------------------------------------------------------------------
        // Otras rutas
        // ------------------------------------------------------------------

        .when('/feedback', {
            template: '<div class="page-placeholder"><h2>Feedback</h2><p>Página en construcción</p></div>'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
