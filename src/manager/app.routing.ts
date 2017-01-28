import * as components from './components/';
import * as services from './services';

export const app_routing = 
[
    { path: '', pathMatch: 'full', redirectTo: '/dashboard' }, 
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
            { path: '', component: components.TicketsComponent },
            { path: 'ticket/:id', component: components.TicketDetailComponent },
            { path: 'clients', component: components.MyClientsComponent },
            { path: 'new', component: components.NewClientsComponent },
            //{ path: 'finance', component: components.FinanceComponent },
        ]
    }               
];
