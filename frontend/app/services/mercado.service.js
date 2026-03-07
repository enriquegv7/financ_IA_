angular.module('financialHubApp')
.service('MercadoService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
    this.getAcciones = function() {
        return $http.get(API_BASE_URL + '/mercado/acciones');
    };

    this.getAccionDetalle = function(ticker) {
        return $http.get(API_BASE_URL + '/mercado/acciones/' + ticker);
    };

    this.getSectores = function() {
        return $http.get(API_BASE_URL + '/mercado/sectores');
    };

    this.getHeatmapData = function() {
        return $http.get(API_BASE_URL + '/mercado/heatmap');
    };

    this.getEstadisticas = function() {
        return $http.get(API_BASE_URL + '/mercado/estadisticas');
    };

    this.buscarGlobal = function(params) {
        return $http.get(API_BASE_URL + '/global/buscar', { params: params });
    };
}]);
