angular.module('financialHubApp')
.component('loginComponent', {
    template: `
    <div class="login-page">
        <div class="login-container">
            <div class="login-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"></path><path d="M18 9l-5 5-2-2-4 4"></path></svg>
                <h1>Financial Hub</h1>
            </div>

            <form class="login-form" ng-submit="$ctrl.login()">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" ng-model="$ctrl.email" required placeholder="tu@email.com">
                </div>

                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" ng-model="$ctrl.password" required placeholder="********">
                </div>

                <button type="submit" class="btn btn-primary btn-block" ng-disabled="$ctrl.loading">
                    <span ng-if="!$ctrl.loading">Iniciar sesión</span>
                    <span ng-if="$ctrl.loading" class="spinner">Cargando...</span>
                </button>
            </form>

            <div class="login-footer">
                <a href="#/register">¿No tienes cuenta? Regístrate</a>
            </div>
        </div>
    </div>
    `,
    controller: ['AuthService', '$location', function(AuthService, $location) {
        var ctrl = this;
        ctrl.email    = '';
        ctrl.password = '';
        ctrl.loading  = false;

        ctrl.login = function() {
            ctrl.loading = true;
            AuthService.login({ email: ctrl.email, password: ctrl.password })
                .then(function() {
                    $location.path('/mercado-espanol');
                })
                .finally(function() {
                    ctrl.loading = false;
                });
        };
    }]
});
