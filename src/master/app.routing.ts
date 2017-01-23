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
            {
                path: 'offers',
                children: [
                    //{ path: ':id', component: components.OfferDetailsComponent },
                    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
                ]
            },
            { path: 'calls', component: components.CallsComponent },
            {
                path: 'routes',
                children: [
                    //{ path: ':id', component: components.RouteDetailsComponent },
                    { path: '', component: components.RoutesComponent }
                ]
            },
            {
                path: 'finance',
                children: [
                    //{ path: 'fillup', component: components.FillUpComponent },
                    { path: '', component: components.FinanceComponent }
                ]
            }
        ]
    }                
];
