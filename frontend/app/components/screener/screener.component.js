angular.module('financialHubApp')
.component('screenerComponent', {
    template: `
    <div class="page-container">
        <div class="screener-header">
            <div class="filter-tabs">
                <button ng-class="{active: $ctrl.currentTab === 'Todas'}" ng-click="$ctrl.setTab('Todas')">Todas</button>
                <button ng-class="{active: $ctrl.currentTab === 'IBEX35'}" ng-click="$ctrl.setTab('IBEX35')">IBEX35</button>
                <button ng-class="{active: $ctrl.currentTab === 'Watchlist'}" ng-click="$ctrl.setTab('Watchlist')">Watchlist</button>
            </div>
            
            <div class="filter-dropdowns">
                <select ng-model="$ctrl.selectedSector" ng-change="$ctrl.updateHeatmap()" ng-options="sector.nombre as sector.nombre for sector in $ctrl.sectores">
                    <option value="">Todos los sectores</option>
                </select>
                
                <div class="toggle-group">
                    <span class="small-label">Visualizar por:</span>
                    <button class="toggle-btn" ng-class="{active: $ctrl.viewMode === 'cap'}" ng-click="$ctrl.setViewMode('cap')">Capitalización</button>
                    <button class="toggle-btn" ng-class="{active: $ctrl.viewMode === 'vol'}" ng-click="$ctrl.setViewMode('vol')">Volumen</button>
                </div>
            </div>
        </div>

        <div class="heatmap-section card">
            <div class="heatmap-header">
                <div>
                    <h2>Mapa de Calor del Mercado</h2>
                    <span class="text-secondary small-label">{{$ctrl.filteredData.length}} acciones | Usa la rueda del ratón para hacer zoom</span>
                </div>
            </div>
            
            <div id="heatmap-container" class="heatmap-container">
                <!-- D3 Heatmap will be rendered here -->
            </div>

            <div class="heatmap-legend">
                <div class="legend-item"><span class="color-box" style="background: var(--heatmap-v3)"></span> >+3%</div>
                <div class="legend-item"><span class="color-box" style="background: var(--heatmap-v1)"></span> +1% to +3%</div>
                <div class="legend-item"><span class="color-box" style="background: var(--heatmap-v0)"></span> 0% to +1%</div>
                <div class="legend-item"><span class="color-box" style="background: var(--heatmap-zero)"></span> 0%</div>
                <div class="legend-item"><span class="color-box" style="background: var(--heatmap-m0)"></span> 0% to -1%</div>
                <div class="legend-item"><span class="color-box" style="background: var(--heatmap-m1)"></span> -1% to -3%</div>
                <div class="legend-item"><span class="color-box" style="background: var(--heatmap-m3)"></span> <-3%</div>
            </div>
        </div>
    </div>

    <style>
        .screener-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .filter-tabs {
            display: flex;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            padding: 4px;
        }
        .filter-tabs button {
            padding: 0.5rem 1.25rem;
            border: none;
            background: none;
            color: var(--text-secondary);
            font-weight: 500;
            cursor: pointer;
            border-radius: 6px;
        }
        .filter-tabs button.active {
            background-color: var(--accent);
            color: white;
        }
        
        .filter-dropdowns {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        select {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-subtle);
            color: var(--text-primary);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
        }
        
        .toggle-group {
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: var(--bg-secondary);
            padding: 4px;
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
        }
        .toggle-btn {
            border: none;
            background: none;
            color: var(--text-secondary);
            padding: 4px 12px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 12px;
        }
        .toggle-btn.active {
            background-color: #2a2a35;
            color: var(--text-primary);
        }

        .heatmap-container {
            width: 100%;
            height: 600px;
            background-color: #000;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        
        .heatmap-legend {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 1.5rem;
            flex-wrap: wrap;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: var(--text-secondary);
        }
        .color-box {
            width: 12px;
            height: 12px;
            border-radius: 2px;
        }
        
        .d3-tooltip {
            position: absolute;
            background: #1e1e24;
            border: 1px solid #333;
            padding: 10px;
            border-radius: 4px;
            pointer-events: none;
            z-index: 100;
            color: white;
            font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
    </style>
    `,
    controller: ['MercadoService', '$timeout', '$element', function(MercadoService, $timeout, $element) {
        var ctrl = this;
        ctrl.currentTab = 'Todas';
        ctrl.selectedSector = '';
        ctrl.viewMode = 'cap'; // 'cap' or 'vol'
        ctrl.rawData = [];
        ctrl.filteredData = [];
        ctrl.sectores = [];
        
        ctrl.$onInit = function() {
            ctrl.loadData();
            ctrl.loadSectores();
            
            // Auto refresh every 30s
            ctrl.refreshInterval = setInterval(function() {
                ctrl.loadData(true);
            }, 30000);
        };
        
        ctrl.$onDestroy = function() {
            if (ctrl.refreshInterval) clearInterval(ctrl.refreshInterval);
        };
        
        ctrl.loadData = function(isRefresh) {
            MercadoService.getHeatmapData().then(function(response) {
                ctrl.rawData = response.data;
                ctrl.updateHeatmap();
            });
        };
        
        ctrl.loadSectores = function() {
            MercadoService.getSectores().then(function(response) {
                ctrl.sectores = response.data;
            });
        };
        
        ctrl.setTab = function(tab) {
            ctrl.currentTab = tab;
            ctrl.updateHeatmap();
        };
        
        ctrl.setViewMode = function(mode) {
            ctrl.viewMode = mode;
            ctrl.updateHeatmap();
        };
        
        ctrl.updateHeatmap = function() {
            // Filtering logic
            ctrl.filteredData = ctrl.rawData.filter(function(item) {
                if (ctrl.currentTab === 'IBEX35') {
                    // All are IBEX in our mock for now, but in real app we'd filter
                }
                if (ctrl.selectedSector && item.sector !== ctrl.selectedSector) return false;
                return true;
            });
            
            $timeout(function() {
                ctrl.renderD3Heatmap();
            });
        };
        
        ctrl.getColor = function(val) {
            if (val > 3) return '#16a34a';
            if (val > 1) return '#22c55e';
            if (val > 0) return '#86efac';
            if (val === 0) return '#374151';
            if (val > -1) return '#fca5a5';
            if (val > -3) return '#ef4444';
            return '#dc2626';
        };

        ctrl.renderD3Heatmap = function() {
            var container = d3.select("#heatmap-container");
            container.selectAll("*").remove();
            
            var width = $element[0].querySelector('#heatmap-container').clientWidth;
            var height = 600;
            
            var svg = container.append("svg")
                .attr("width", width)
                .attr("height", height);
            
            var root = d3.hierarchy({ children: ctrl.filteredData })
                .sum(d => ctrl.viewMode === 'cap' ? d.capitalizacion : (d.volumen || 1000));

            d3.treemap()
                .size([width, height])
                .padding(1)
                (root);

            var cells = svg.selectAll("g")
                .data(root.leaves())
                .enter().append("g")
                .attr("transform", d => `translate(${d.x0},${d.y0})`);

            cells.append("rect")
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .attr("fill", d => ctrl.getColor(d.data.cambio_pct))
                .attr("stroke", "#000")
                .on("mouseover", function(event, d) {
                    ctrl.showTooltip(event, d.data);
                })
                .on("mouseout", function() {
                    ctrl.hideTooltip();
                });

            cells.append("text")
                .attr("x", d => (d.x1 - d.x0) / 2)
                .attr("y", d => (d.y1 - d.y0) / 2 - 5)
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .attr("font-weight", "600")
                .style("font-size", d => Math.min((d.x1 - d.x0) / 5, (d.y1 - d.y0) / 5, 14) + "px")
                .text(d => d.data.ticker)
                .style("display", d => (d.x1 - d.x0 > 30 && d.y1 - d.y0 > 20) ? "block" : "none");

            cells.append("text")
                .attr("x", d => (d.x1 - d.x0) / 2)
                .attr("y", d => (d.y1 - d.y0) / 2 + 10)
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .style("font-size", d => Math.min((d.x1 - d.x0) / 7, (d.y1 - d.y0) / 7, 11) + "px")
                .text(d => (d.data.cambio_pct > 0 ? "+" : "") + d.data.cambio_pct + "%")
                .style("display", d => (d.x1 - d.x0 > 40 && d.y1 - d.y0 > 35) ? "block" : "none");
        };
        
        var tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
            .style("opacity", 0);
            
        ctrl.showTooltip = function(event, data) {
            tooltip.transition().duration(200).style("opacity", .95);
            tooltip.html(`
                <div style="font-weight:600; font-size:14px; margin-bottom:4px">${data.nombre} (${data.ticker})</div>
                <div style="color:#aaa; margin-bottom:8px">${data.sector}</div>
                <div style="display:flex; justify-content:space-between; gap:20px">
                    <span>Precio:</span> <span>${data.precio.toFixed(2)} €</span>
                </div>
                <div style="display:flex; justify-content:space-between; gap:20px">
                    <span>Cambio:</span> <span class="${data.cambio_pct > 0 ? 'text-positive' : 'text-negative'}">${data.cambio_pct}%</span>
                </div>
                <div style="display:flex; justify-content:space-between; gap:20px">
                    <span>Capitalización:</span> <span>${(data.capitalizacion / 1e9).toFixed(2)}B €</span>
                </div>
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        };
        
        ctrl.hideTooltip = function() {
            tooltip.transition().duration(500).style("opacity", 0);
        };
    }]
});
