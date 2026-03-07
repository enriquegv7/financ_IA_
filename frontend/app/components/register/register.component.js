angular.module('financialHubApp')
.component('registerComponent', {
    template: `
    <div class="login-page">
        <div class="login-container">
            <div class="login-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"></path><path d="M18 9l-5 5-2-2-4 4"></path></svg>
                <h1>Financial Hub</h1>
            </div>

            <form class="login-form" ng-submit="$ctrl.register()">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" ng-model="$ctrl.nombre" required placeholder="Tu nombre">
                </div>

                <div class="form-group">
                    <label>Apellidos</label>
                    <input type="text" ng-model="$ctrl.apellidos" required placeholder="Tus apellidos">
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" ng-model="$ctrl.email" required placeholder="tu@email.com">
                </div>

                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" ng-model="$ctrl.password" required placeholder="Mínimo 8 caracteres">
                </div>

                <div class="form-group">
                    <label>Confirmar contraseña</label>
                    <input type="password" ng-model="$ctrl.passwordConfirm" required placeholder="Repite tu contraseña">
                </div>

                <button type="submit" class="btn btn-primary btn-block" ng-disabled="$ctrl.loading">
                    <span ng-if="!$ctrl.loading">Crear cuenta</span>
                    <span ng-if="$ctrl.loading" class="spinner">Cargando...</span>
                </button>
            </form>

            <div class="login-footer">
                <a href="#/login">¿Ya tienes cuenta? Inicia sesión</a>
            </div>
        </div>
    </div>
    `,
    controller: [function() {
        var ctrl = this;
        ctrl.nombre          = '';
        ctrl.apellidos       = '';
        ctrl.email           = '';
        ctrl.password        = '';
        ctrl.passwordConfirm = '';
        ctrl.loading         = false;

        ctrl.register = function() {
            // TODO: conectar con base de datos real
        };
    }]
});
