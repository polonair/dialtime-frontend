import { Component } from '@angular/core';

import * as services from '../services';

@Component({
    selector: 'tc-navigation',
    template:
    `
    <tc-container tabindex="0">
        <tc-expander></tc-expander>
        <tc-menu>
            <tc-collapser></tc-collapser>
            <a routerLink="/dashboard">Тикеты</a>
            <a routerLink="/dashboard/clients">Мои клиенты</a>
            <a routerLink="/dashboard/new">Свободные клиенты</a>
            <a href="#" (click)="logout()">Выход</a>
        </tc-menu>
    </tc-container>
    `
})
export class Navigation{
    constructor(private user: services.UserService){}
    logout(){ this.user.logout(); return false; }
}
