angular.module('financialHubApp')
.component('globalComponent', {
    template: `
    <div class="page-container">
        <div class="search-header">
            <h1>Buscador Global</h1>
            <p class="text-secondary">Encuentra fondos, planes de pensiones, ETFs y más. Búsqueda inteligente por nombre, ISIN, ticker o código DGS.</p>

            <div class="search-input-wrapper">
                <input type="text" ng-model="$ctrl.searchQuery" ng-change="$ctrl.onSearchChange()"
                       placeholder="Escribe el nombre del activo, ISIN o ticker..." class="search-input">
                <div class="search-pills">
                    <button ng-class="{active: $ctrl.selectedType === 'Acciones'}"  ng-click="$ctrl.setType('Acciones')">Acciones</button>
                    <button ng-class="{active: $ctrl.selectedType === 'Fondos'}"    ng-click="$ctrl.setType('Fondos')">Fondos</button>
                    <button ng-class="{active: $ctrl.selectedType === 'Pensiones'}" ng-click="$ctrl.setType('Pensiones')">Pensiones</button>
                    <button ng-class="{active: $ctrl.selectedType === 'ETFs'}"      ng-click="$ctrl.setType('ETFs')">ETFs</button>
                </div>
            </div>

            <div class="search-tip">
                <span>Truco: Escribe un ticker español (SAN, BBVA) para filtrar acciones.</span>
            </div>
        </div>

        <div class="search-results card">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Ticker/ISIN</th>
                        <th>Tipo</th>
                        <th>Mercado</th>
                        <th>Precio</th>
                        <th>Cambio %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat="item in $ctrl.results">
                        <td>{{item.nombre}}</td>
                        <td class="text-secondary">{{item.ticker}}</td>
                        <td>{{item.tipo}}</td>
                        <td>{{item.mercado}}</td>
                        <td>{{item.precio | number:2}} €</td>
                        <td ng-class="item.cambio_pct > 0 ? 'text-positive' : 'text-negative'">
                            {{item.cambio_pct > 0 ? '+' : ''}}{{item.cambio_pct}}%
                        </td>
                    </tr>
                    <tr ng-if="$ctrl.results.length === 0">
                        <td colspan="6" style="text-align:center; padding:2rem" class="text-secondary">
                            No se encontraron resultados
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    controller: ['GlobalService', '$timeout', function(GlobalService, $timeout) {
        var ctrl = this;
        ctrl.searchQuery  = '';
        ctrl.selectedType = 'Acciones';
        ctrl.results      = [];
        var searchTimeout = null;

        ctrl.$onInit = function() {
            ctrl.performSearch();
        };

        ctrl.onSearchChange = function() {
            if (searchTimeout) $timeout.cancel(searchTimeout);
            searchTimeout = $timeout(ctrl.performSearch, 300);
        };

        ctrl.setType = function(type) {
            ctrl.selectedType = type;
            ctrl.performSearch();
        };

        ctrl.performSearch = function() {
            GlobalService.buscar(ctrl.searchQuery).then(function(response) {
                ctrl.results = response.data;
            });
        };
    }]
});
