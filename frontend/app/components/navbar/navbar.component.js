angular.module('financialHubApp')
.component('navbarComponent', {
    template: `
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-left">
                <a href="#/" class="logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="M18 9l-5 5-2-2-4 4"></path></svg>
                    <span>Financial Hub</span>
                </a>
            </div>
            
            <button class="menu-toggle" ng-click="$ctrl.toggleMobileMenu()">
                <span></span><span></span><span></span>
            </button>

            <div class="nav-center" ng-class="{'mobile-open': $ctrl.mobileMenuOpen}">
                <a href="#/mercado-espanol" ng-class="{active: $ctrl.isActive('/mercado-espanol')}">Mercado</a>
                <a href="#/mercado-espanol/screener" ng-class="{active: $ctrl.isActive('/screener')}">Screener</a>
                <a href="#/mercado-espanol/estadisticas" ng-class="{active: $ctrl.isActive('/estadisticas')}">Estadísticas</a>
                <a href="#/global" ng-class="{active: $ctrl.isActive('/global')}">Global</a>
                <a href="#/feedback" ng-class="{active: $ctrl.isActive('/feedback')}">Feedback</a>
                <a href="#/mercado-espanol/pizarra-andres" ng-class="{active: $ctrl.isActive('/pizarra-andres')}">Pizarra de Andrés</a>
            </div>

            <div class="nav-right">
                <button class="nav-icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </button>
                <a href="#/login" class="btn btn-primary" ng-if="!$ctrl.isLoggedIn()">Iniciar sesión</a>
                <div class="user-profile" ng-if="$ctrl.isLoggedIn()">
                     <span>{{$ctrl.user.nombre}}</span>
                </div>
            </div>
        </div>
        
        <div class="mobile-bottom-bar">
            <a href="#/fondos" class="mobile-bottom-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Fondos</span>
            </a>
            <a href="#/mercado-espanol/pizarra-andres" class="mobile-bottom-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                <span>Andrés</span>
            </a>
        </div>
    </nav>
    <style>
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 56px;
            background-color: var(--bg-navbar);
            border-bottom: 1px solid var(--border-subtle);
            z-index: 1000;
        }
        .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.5rem;
        }
        .nav-left .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
            font-size: 18px;
            color: var(--text-primary);
        }
        .nav-left .logo svg { color: var(--accent); }
        
        .nav-center {
            display: flex;
            gap: 1.5rem;
            height: 100%;
        }
        .nav-center a {
            display: flex;
            align-items: center;
            height: 100%;
            font-size: 14px;
            color: var(--text-secondary);
            font-weight: 500;
            position: relative;
        }
        .nav-center a:hover, .nav-center a.active {
            color: var(--accent);
        }
        .nav-center a.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background-color: var(--accent);
        }
        
        .nav-right {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .nav-icon-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 4px;
        }
        
        .menu-toggle { display: none; }
        .mobile-bottom-bar { display: none; }

        @media (max-width: 1024px) {
            .nav-center { display: none; }
            .nav-center.mobile-open {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 56px;
                left: 0;
                right: 0;
                background-color: var(--bg-navbar);
                height: auto;
                padding: 1rem;
                gap: 1rem;
                border-bottom: 1px solid var(--border-subtle);
            }
            .menu-toggle {
                display: flex;
                flex-direction: column;
                gap: 4px;
                background: none;
                border: none;
                cursor: pointer;
            }
            .menu-toggle span {
                width: 24px;
                height: 2px;
                background-color: var(--text-primary);
            }
            .mobile-bottom-bar {
                display: flex;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 56px;
                background-color: var(--bg-navbar);
                border-top: 1px solid var(--border-subtle);
                justify-content: space-around;
                align-items: center;
            }
            .mobile-bottom-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                font-size: 10px;
                color: var(--text-secondary);
            }
        }
    </style>
    `,
    controller: ['$location', 'AuthService', function($location, AuthService) {
        var ctrl = this;
        ctrl.mobileMenuOpen = false;
        
        ctrl.isActive = function(path) {
            return $location.path().indexOf(path) !== -1;
        };
        
        ctrl.toggleMobileMenu = function() {
            ctrl.mobileMenuOpen = !ctrl.mobileMenuOpen;
        };
        
        ctrl.isLoggedIn = function() {
            return AuthService.isLoggedIn();
        };
        
        ctrl.user = AuthService.getUser();
    }]
});
