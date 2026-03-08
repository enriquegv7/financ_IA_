angular.module('financialHubApp')
.component('registerComponent', {
    template: `
    <div class="login-page">
        <div class="login-container">
            <div class="login-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3v18h18"></path>
                    <path d="M18 9l-5 5-2-2-4 4"></path>
                </svg>
                <h1>Financial Hub</h1>
            </div>

            <!-- Mensaje de error -->
            <div class="alert alert-error" ng-if="$ctrl.error">
                {{ $ctrl.error }}
            </div>

            <!-- Mensaje de éxito -->
            <div class="alert alert-success" ng-if="$ctrl.success">
                {{ $ctrl.success }}
            </div>

            <form class="login-form" ng-submit="$ctrl.register()" ng-if="!$ctrl.success">

                <div class="form-group">
                    <label>Nombre de usuario</label>
                    <input
                        type="text"
                        ng-model="$ctrl.username"
                        required
                        minlength="3"
                        maxlength="50"
                        pattern="[a-zA-Z0-9_]+"
                        placeholder="ej: juan_garcia"
                        autocomplete="username">
                    <small>Solo letras, números y guion bajo. Mínimo 3 caracteres.</small>
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" ng-model="$ctrl.email" required placeholder="tu@email.com" autocomplete="email">
                </div>

                <div class="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        ng-model="$ctrl.password"
                        required
                        minlength="8"
                        placeholder="Mínimo 8 caracteres"
                        autocomplete="new-password">
                </div>

                <div class="form-group">
                    <label>Confirmar contraseña</label>
                    <input
                        type="password"
                        ng-model="$ctrl.passwordConfirm"
                        required
                        placeholder="Repite tu contraseña"
                        autocomplete="new-password">
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
    controller: ['AuthService', '$location', function(AuthService, $location) {
        var ctrl = this;
        ctrl.username        = '';
        ctrl.email           = '';
        ctrl.password        = '';
        ctrl.passwordConfirm = '';
        ctrl.loading         = false;
        ctrl.error           = null;
        ctrl.success         = null;

        // Si ya está autenticado, redirigir
        if (AuthService.isLoggedIn()) {
            $location.path('/mercado-espanol');
        }

        ctrl.register = function() {
            ctrl.error   = null;
            ctrl.success = null;

            // Validación local: las contraseñas deben coincidir
            if (ctrl.password !== ctrl.passwordConfirm) {
                ctrl.error = 'Las contraseñas no coinciden';
                return;
            }

            ctrl.loading = true;

            AuthService.register({
                email:    ctrl.email,
                username: ctrl.username,
                password: ctrl.password
            })
            .then(function() {
                ctrl.success = '¡Cuenta creada! Redirigiendo al login...';
                // Redirigir al login tras 1.5 segundos
                setTimeout(function() { $location.path('/login'); }, 1500);
            })
            .catch(function(response) {
                ctrl.error = (response.data && response.data.detail)
                    ? response.data.detail
                    : 'Error al crear la cuenta. Inténtalo de nuevo.';
            })
            .finally(function() {
                ctrl.loading = false;
            });
        };
    }]
});
