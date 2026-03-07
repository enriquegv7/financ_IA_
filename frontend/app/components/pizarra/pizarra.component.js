angular.module('financialHubApp')
.component('pizarraComponent', {
    template: `
    <div class="page-container">
        <div class="editorial-header">
            <h1>La Pizarra de Andrés</h1>
            <p class="text-secondary">Análisis exclusivo y opiniones del mercado bursátil por Andrés.</p>
        </div>

        <div class="articles-grid">
            <div class="card article-card" ng-repeat="post in $ctrl.posts">
                <div class="small-label" style="margin-bottom:0.5rem; color:var(--accent)">ANÁLISIS • {{post.date}}</div>
                <h2>{{post.title}}</h2>
                <p class="text-secondary">{{post.excerpt}}</p>
                <div style="margin-top:1.5rem">
                    <a href="" class="btn btn-primary" style="padding:0.4rem 1rem; font-size:13px">Leer más</a>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: [function() {
        var ctrl = this;
        ctrl.posts = [
            {
                title:   "Perspectivas del IBEX35 para el segundo trimestre",
                date:    "07 MAR 2026",
                excerpt: "Analizamos los niveles clave de soporte y resistencia para el selectivo español tras los últimos movimientos de tipos..."
            },
            {
                title:   "¿Es momento de entrar en el sector bancario?",
                date:    "05 MAR 2026",
                excerpt: "Con los márgenes de interés en niveles récord, evaluamos si Santander y BBVA todavía tienen recorrido al alza..."
            },
            {
                title:   "Infraestructuras: El refugio de la inflación",
                date:    "01 MAR 2026",
                excerpt: "Ferrovial y ACS presentan una oportunidad única en el entorno macro actual por sus contratos indexados..."
            }
        ];
    }]
});
