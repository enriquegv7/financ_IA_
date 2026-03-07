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

    <style>
        .login-page {
            display: flex;
            align-items: center;
            justify-content: center;
            height: calc(100vh - 56px);
        }
        .login-container {
            width: 100%;
            max-width: 400px;
            padding: 2rem;
            text-align: center;
        }
        .login-logo {
            margin-bottom: 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        .login-logo svg { color: var(--accent); }
        .login-logo h1 { font-size: 28px; margin: 0; }
        
        .login-form {
            text-align: left;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 13px;
            color: var(--text-secondary);
        }
        .form-group input {
            width: 100%;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-subtle);
            color: var(--text-primary);
            padding: 0.75rem 1rem;
            border-radius: 8px;
            outline: none;
        }
        .form-group input:focus {
            border-color: var(--accent);
        }
        
        .btn-block { width: 100%; padding: 0.75rem; font-size: 16px; margin-top: 1rem; }
        
        .login-footer {
            margin-top: 2rem;
            font-size: 14px;
        }
        .login-footer a { color: var(--accent); }
        
        .spinner {
            display: inline-block;
            animation: rotate 2s linear infinite;
        }
        @keyframes rotate {
            100% { transform: rotate(360deg); }
        }
    </style>
    `,
    controller: ['AuthService', '$location', function(AuthService, $location) {
        var ctrl = this;
        ctrl.email = '';
        ctrl.password = '';
        ctrl.loading = false;
        
        ctrl.login = function() {
            ctrl.loading = true;
            AuthService.login({
                email: ctrl.email,
                password: ctrl.password
            }).then(function() {
                $location.path('/mercado-espanol');
            }).finally(function() {
                ctrl.loading = false;
            });
        };
    }]
});
