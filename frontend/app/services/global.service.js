angular.module('financialHubApp')
.service('GlobalService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
    this.buscar = function(query) {
        return $http.get(API_BASE_URL + '/busqueda/global', { params: { q: query } });
    };
}]);
