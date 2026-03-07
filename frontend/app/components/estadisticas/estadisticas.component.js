angular.module('financialHubApp')
.component('estadisticasComponent', {
    template: `
    <div class="page-container">
        <h1>Estadísticas del Mercado</h1>
        <div class="card">
            <p class="text-secondary text-center">Datos agregados del mercado español en tiempo real.</p>
            <div style="height: 400px; display: flex; align-items: center; justify-content: center;">
                <canvas id="statsChart"></canvas>
            </div>
        </div>
    </div>
    `,
    controller: ['MercadoService', '$timeout', function(MercadoService, $timeout) {
        var ctrl = this;
        ctrl.$onInit = function() {
            MercadoService.getEstadisticas().then(function(response) {
                var data = response.data;
                $timeout(function() {
                    var ctx = document.getElementById('statsChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Suben', 'Bajan', 'Sin Cambio'],
                            datasets: [{
                                data: [data.suben, data.bajan, data.sin_cambio],
                                backgroundColor: ['#22c55e', '#ef4444', '#374151'],
                                borderColor: 'transparent'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { color: '#e8e8ee' }
                                }
                            }
                        }
                    });
                });
            });
        };
    }]
});
