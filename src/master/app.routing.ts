import * as components from './components/';
import * as services from './services';

export const app_routing = 
[
    { path: '', component: components.LandingComponent },
    {
        path: 'auth', canActivate: [ services.LoggedOutGuard ],
        children: [
            { path: 'login', component: components.LoginComponent },
            { path: 'register', component: components.RegisterComponent }
        ]
    },
    {
        path: 'dashboard', component: components.DashboardComponent, canActivate: [ services.LoggedInGuard ],
        children: [
            { path: '', component: components.OffersComponent },
            { path: 'offers', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'offer/:id', component: components.OfferDetailsComponent },
            { path: 'calls', component: components.CallsComponent },
            { path: 'routes', component: components.RoutesComponent },
            { path: 'route/:id', component: components.RouteDetailsComponent },
            { path: 'finance', component: components.FinanceComponent }
        ]
    }                
];
