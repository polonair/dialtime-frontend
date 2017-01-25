import { Component } from '@angular/core';
import { NGMeta } from "ngmeta";
import { Router } from '@angular/router';

import * as services from '../services';
import * as settings from '../app.settings';

@Component({
    selector: 'tc-dashboard',
    template:
    `
    <tc-header>
        <tc-wrapper>
            <tc-logo><a routerLink="/"><i></i><i></i></a></tc-logo>
            <tc-head>{{ title }}</tc-head>
            <tc-navigation></tc-navigation>
        </tc-wrapper>
    </tc-header>
    <tc-content>
        <tc-wrapper>
            <router-outlet></router-outlet>
        </tc-wrapper>
    </tc-content>
    <tc-footer>
        <tc-wrapper>
            &copy; TargetCall, 2014-2017
        </tc-wrapper>
    </tc-footer>    
    `
})
export class DashboardComponent{
    private title: string = "...";
    constructor(
        private ngmeta: NGMeta,
        private user: services.UserService, 
        private router: Router,
        private interractor: services.InterractorService) {
        this.interractor.lastTitle.subscribe(title => {
            this.title = title;
            this.ngmeta.setMeta("name", "theme-color", settings.THEME_COLOR );
            this.ngmeta.setHead({ title: 'TargetCall | ' + this.title });
        });
    }
    logout(){
        this.user.logout().then(() => { this.router.navigate(['/auth/login']); });
        return false;
    }
}
