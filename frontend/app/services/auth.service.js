/**
 * AuthService — gestiona login, registro, tokens y estado del usuario.
 *
 * Almacenamiento en localStorage:
 *   fh_access_token  → JWT de acceso (corta duración)
 *   fh_refresh_token → JWT de refresco (larga duración)
 *   fh_user          → objeto JSON con datos del usuario actual
 */
angular.module('financialHubApp')
.service('AuthService', ['$http', '$window', '$q', 'API_BASE_URL',
function($http, $window, $q, API_BASE_URL) {

    var self = this;

    // Cache en memoria del usuario actual
    var currentUser = null;

    // ---------------------------------------------------------------------------
    // Helpers de almacenamiento
    // ---------------------------------------------------------------------------

    function saveTokens(accessToken, refreshToken) {
        $window.localStorage.setItem('fh_access_token', accessToken);
        $window.localStorage.setItem('fh_refresh_token', refreshToken);
    }

    function clearStorage() {
        $window.localStorage.removeItem('fh_access_token');
        $window.localStorage.removeItem('fh_refresh_token');
        $window.localStorage.removeItem('fh_user');
        currentUser = null;
    }

    function saveUser(user) {
        currentUser = user;
        $window.localStorage.setItem('fh_user', JSON.stringify(user));
    }

    function loadUserFromStorage() {
        var stored = $window.localStorage.getItem('fh_user');
        if (stored) {
            try { currentUser = JSON.parse(stored); } catch (e) { currentUser = null; }
        }
        return currentUser;
    }

    // ---------------------------------------------------------------------------
    // API pública
    // ---------------------------------------------------------------------------

    /**
     * Inicia sesión. Almacena tokens y carga perfil del usuario.
     * @param {Object} credentials  { email, password }
     * @returns Promise con los datos del usuario
     */
    self.login = function(credentials) {
        // En el backend el schema es UsuarioLogin: { correo_electronico, contrasena }
        var payload = {
            correo_electronico: credentials.email || credentials.correo_electronico,
            contrasena: credentials.password || credentials.contrasena
        };
        return $http.post(API_BASE_URL + '/autenticacion/login', payload)
            .then(function(response) {
                var tokens = response.data;
                // El backend devuelve token_acceso y token_refresco
                saveTokens(tokens.token_acceso, tokens.token_refresco);
                return self.fetchProfile();
            });
    };

    /**
     * Registra un nuevo usuario (role=user, plan=free).
     * @param {Object} data  { email, username, password }
     * @returns Promise con los datos del usuario creado
     */
    self.register = function(data) {
        var payload = {
            correo_electronico: data.email || data.correo_electronico,
            nombre_usuario: data.username || data.nombre_usuario,
            contrasena: data.password || data.contrasena
        };
        return $http.post(API_BASE_URL + '/autenticacion/registro', payload)
            .then(function(response) {
                return response.data;
            });
    };

    /**
     * Obtiene el perfil del usuario autenticado desde /auth/me.
     * Requiere que el access token esté guardado (el interceptor lo inyecta).
     */
    self.fetchProfile = function() {
        return $http.get(API_BASE_URL + '/autenticacion/perfil')
            .then(function(response) {
                saveUser(response.data);
                return response.data;
            });
    };

    /**
     * Renueva el access token usando el refresh token almacenado.
     * @returns Promise con los nuevos tokens
     */
    self.refreshToken = function() {
        var refreshToken = $window.localStorage.getItem('fh_refresh_token');
        if (!refreshToken) {
            return $q.reject({ detail: 'No hay refresh token disponible' });
        }
        return $http.post(API_BASE_URL + '/autenticacion/refrescar', { token_refresco: refreshToken })
            .then(function(response) {
                var tokens = response.data;
                saveTokens(tokens.token_acceso, tokens.token_refresco);
                return tokens;
            });
    };

    /** Cierra sesión: limpia tokens y datos del usuario. */
    self.logout = function() {
        clearStorage();
    };

    // ---------------------------------------------------------------------------
    // Estado del usuario
    // ---------------------------------------------------------------------------

    /** Devuelve el usuario actual (desde caché o localStorage). */
    self.getUser = function() {
        return currentUser || loadUserFromStorage();
    };

    /** Devuelve true si hay un access token almacenado. */
    self.isLoggedIn = function() {
        return !!$window.localStorage.getItem('fh_access_token');
    };

    /**
     * Comprueba si el usuario tiene un role concreto.
     * @param {string} role  'admin' | 'user'
     */
    self.hasRole = function(role) {
        var user = self.getUser();
        return user && user.role === role;
    };

    /**
     * Comprueba si el usuario tiene un plan concreto o es admin.
     * @param {string} plan  'free' | 'paid'
     */
    self.hasPlan = function(plan) {
        var user = self.getUser();
        if (!user) return false;
        return user.plan === plan || user.role === 'admin';
    };

    // Cargar usuario desde localStorage al inicializar el servicio
    loadUserFromStorage();
}])


/**
 * AuthInterceptor — inyecta el JWT en cada petición HTTP saliente
 * y redirige a /login ante respuestas 401.
 *
 * Registrado en app.module.js vía $httpProvider.interceptors.push('AuthInterceptor').
 */
.factory('AuthInterceptor', ['$window', '$q', '$injector',
function($window, $q, $injector) {
    return {

        /** Añade el header Authorization si hay token. */
        request: function(config) {
            var token = $window.localStorage.getItem('fh_access_token');
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = 'Bearer ' + token;
            }
            return config;
        },

        /** Ante un 401, limpia la sesión y redirige al login. */
        responseError: function(rejection) {
            if (rejection.status === 401) {
                $window.localStorage.removeItem('fh_access_token');
                $window.localStorage.removeItem('fh_refresh_token');
                $window.localStorage.removeItem('fh_user');

                // $injector evita la dependencia circular $http ↔ interceptor
                var $location = $injector.get('$location');
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    };
}])


/**
 * AuthGuard — factoria de guards para proteger rutas en app.routes.js.
 *
 * Uso en resolve:
 *   resolve: { auth: ['AuthGuard', function(g) { return g.requireAuth(); }] }
 *   resolve: { auth: ['AuthGuard', function(g) { return g.requireAdmin(); }] }
 *   resolve: { auth: ['AuthGuard', function(g) { return g.requirePaid(); }] }
 */
.factory('AuthGuard', ['$q', '$location', 'AuthService',
function($q, $location, AuthService) {
    return {

        /** Redirige a /login si el usuario no está autenticado. */
        requireAuth: function() {
            if (AuthService.isLoggedIn()) {
                return $q.resolve();
            }
            $location.path('/login');
            return $q.reject('not_authenticated');
        },

        /** Redirige si el usuario no es admin. */
        requireAdmin: function() {
            if (AuthService.isLoggedIn() && AuthService.hasRole('admin')) {
                return $q.resolve();
            }
            $location.path('/login');
            return $q.reject('not_admin');
        },

        /** Redirige si el usuario no tiene plan paid (admins pasan siempre). */
        requirePaid: function() {
            if (AuthService.isLoggedIn() && AuthService.hasPlan('paid')) {
                return $q.resolve();
            }
            $location.path('/login');
            return $q.reject('not_paid');
        }
    };
}]);
