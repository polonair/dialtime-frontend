import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { NGMeta } from "ngmeta";
import { CookieService } from 'angular2-cookie/services/cookies.service';

import * as components from './components/';
import * as services from './services';
import * as model from './model/';
import * as settings from './app.settings';

import { app_routing } from './app.routing';

import './styles/main.scss';

@NgModule(
{
    imports: [ BrowserModule, RouterModule.forRoot(app_routing), HttpModule ],
    declarations: [ 
    	components.AppComponent,
    	components.DashboardComponent,
    	components.LoginComponent,
        components.MyClientsComponent,
        components.MyClientListComponent,
        components.MyClientItemComponent,
    	components.Navigation,
        components.NewClientsComponent,
        components.NewClientItemComponent,
        components.NewClientsListComponent,
    	components.RegisterComponent,
    	components.TicketsComponent,
        components.TicketListComponent,
        components.TicketItemComponent,
        components.TicketDetailComponent,
    ],
    bootstrap: [ components.AppComponent ],
    providers: [ 
    	NGMeta,
    	CookieService,
		services.LoggedInGuard,
		services.LoggedOutGuard,
		services.InterractorService,
		model.DataRepository,
        { 
            provide: services.ApiRequest, 
            useFactory:(http, cookie)=>{ return new services.ApiRequest(http, cookie, settings.API_URL); }, 
            deps: [ Http, CookieService ] 
        },
        services.UserService,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
