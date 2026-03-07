angular.module('financialHubApp')
.service('AuthService', ['$http', 'API_BASE_URL', '$window', function($http, API_BASE_URL, $window) {
    var self = this;
    var user = null;

    this.login = function(credentials) {
        return $http.post(API_BASE_URL + '/auth/login', credentials)
            .then(function(response) {
                user = response.data;
                $window.localStorage.setItem('fh_token', user.token);
                return user;
            });
    };

    this.logout = function() {
        return $http.post(API_BASE_URL + '/auth/logout')
            .then(function() {
                user = null;
                $window.localStorage.removeItem('fh_token');
            });
    };

    this.getUser = function() {
        return user;
    };

    this.isLoggedIn = function() {
        return !!$window.localStorage.getItem('fh_token');
    };
}]);
