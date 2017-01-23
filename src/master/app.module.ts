import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NGMeta } from "ngmeta";
import { CookieService } from 'angular2-cookie/services/cookies.service';

import * as components from './components/';
import * as services from './services/';
import * as model from './model/';

import { app_routing } from './app.routing';

import './styles/main.scss';

@NgModule(
{
    imports: [ BrowserModule, RouterModule.forRoot(app_routing), HttpModule ],
    declarations: [ 
    	components.AppComponent,
		components.CallsComponent,
		components.CallListComponent,
		components.CallItemComponent,
		components.DashboardComponent,
		components.Navigation,
    	components.LandingComponent, 
    	components.LoginComponent,
		components.OffersComponent,
		components.OfferListComponent,
		components.OfferItemComponent,
    	components.RegisterComponent,
    	components.RoutesComponent,
		components.RouteListComponent,
		components.RouteItemComponent,
		components.FinanceComponent,
		components.TransactionListComponent,
		components.TransactionItemComponent,
		components.NewOfferComponent,
    ],
    bootstrap: [ components.AppComponent ],
    providers: [ 
    	NGMeta,
    	CookieService,
		services.ApiRequest,
		services.LoggedInGuard,
		services.LoggedOutGuard,
		services.UserService,
		services.InterractorService,
		model.DataRepository,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
