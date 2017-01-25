import * as components from './components/';
import * as services from '../common/services/';

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
            { path: '', component: components.CampaignsComponent },
            { path: 'calls', component: components.CallsComponent },
            //{ path: 'finance', component: components.FinanceComponent },
        ]
    }               
];
