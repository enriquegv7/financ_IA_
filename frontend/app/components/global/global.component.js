angular.module('financialHubApp')
.component('globalComponent', {
    template: `
    <div class="page-container">
        <div class="search-header">
            <h1>Buscador Global</h1>
            <p class="text-secondary">Encuentra fondos, planes de pensiones, ETFs y más. Búsqueda inteligente por nombre, ISIN, ticker o código DGS.</p>
            
            <div class="search-input-wrapper">
                <input type="text" ng-model="$ctrl.searchQuery" ng-change="$ctrl.onSearchChange()" placeholder="Escribe el nombre del activo, ISIN o ticker..." class="search-input">
                <div class="search-pills">
                    <button ng-class="{active: $ctrl.selectedType === 'Acciones'}" ng-click="$ctrl.setType('Acciones')">Acciones</button>
                    <button ng-class="{active: $ctrl.selectedType === 'Fondos'}" ng-click="$ctrl.setType('Fondos')">Fondos</button>
                    <button ng-class="{active: $ctrl.selectedType === 'Pensiones'}" ng-click="$ctrl.setType('Pensiones')">Pensiones</button>
                    <button ng-class="{active: $ctrl.selectedType === 'ETFs'}" ng-click="$ctrl.setType('ETFs')">ETFs</button>
                </div>
            </div>
            
            <div class="search-tip">
                <span>💡 Truco: Escribe un ticker español (SAN, BBVA) para priorizar acciones españolas.</span>
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
                        <td colspan="6" style="text-align: center; padding: 2rem;" class="text-secondary">
                            No se encontraron resultados
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <style>
        .search-header {
            text-align: center;
            max-width: 800px;
            margin: 0 auto 3rem;
        }
        .search-header h1 { margin-bottom: 0.5rem; }
        
        .search-input-wrapper {
            margin-top: 2rem;
            position: relative;
        }
        .search-input {
            width: 100%;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-subtle);
            color: var(--text-primary);
            padding: 1.25rem 1.5rem;
            border-radius: 12px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.2s;
        }
        .search-input:focus {
            border-color: var(--accent);
        }
        
        .search-pills {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .search-pills button {
            background-color: #2a2a3533;
            border: 1px solid var(--border-subtle);
            color: var(--text-secondary);
            padding: 6px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
        }
        .search-pills button.active {
            background-color: var(--accent);
            color: white;
            border-color: var(--accent);
        }
        
        .search-tip {
            margin-top: 1.5rem;
            font-size: 13px;
            color: var(--text-secondary);
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }
        .data-table th {
            color: var(--text-secondary);
            font-weight: 500;
            padding: 1rem;
            border-bottom: 1px solid var(--border-subtle);
            font-size: 12px;
            text-transform: uppercase;
        }
        .data-table td {
            padding: 1rem;
            border-bottom: 1px solid var(--border-subtle);
        }
        .data-table tr:hover {
            background-color: rgba(255,255,255,0.02);
        }
    </style>
    `,
    controller: ['MercadoService', '$timeout', function(MercadoService, $timeout) {
        var ctrl = this;
        ctrl.searchQuery = '';
        ctrl.selectedType = 'Acciones';
        ctrl.results = [];
        var searchTimeout;
        
        ctrl.$onInit = function() {
            ctrl.performSearch();
        };
        
        ctrl.onSearchChange = function() {
            if (searchTimeout) $timeout.cancel(searchTimeout);
            searchTimeout = $timeout(function() {
                ctrl.performSearch();
            }, 300);
        };
        
        ctrl.setType = function(type) {
            ctrl.selectedType = type;
            ctrl.performSearch();
        };
        
        ctrl.performSearch = function() {
            MercadoService.buscarGlobal({
                q: ctrl.searchQuery,
                tipo: ctrl.selectedType
            }).then(function(response) {
                ctrl.results = response.data;
            });
        };
    }]
});
