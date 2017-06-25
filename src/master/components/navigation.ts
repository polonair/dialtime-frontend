import { 
    Component, 
} from '@angular/core';

import * as services from '../services';



@Component({
    selector: 'tc-navigation',
    template:
    `
    <tc-container tabindex="0">
        <tc-expander></tc-expander>
        <tc-menu>
            <tc-collapser></tc-collapser>
            <a routerLink="/dashboard" [class.active]="position == 'offers'">Предложения</a>
            <a routerLink="/dashboard/calls" [class.active]="position == 'calls'">Журнал звонков</a>
            <a routerLink="/dashboard/routes" [class.active]="position == 'routes'">Контакты</a>
            <a routerLink="/dashboard/finance" [class.active]="position == 'finances'">Финансы</a>
            <a href="#" (click)="logout()">Выход</a>
        </tc-menu>
    </tc-container>
    `
})
export class Navigation{
    private position: string;
    constructor(private user: services.UserService, private interractor: services.InterractorService)
    {
        this.interractor.lastPosition.subscribe(position => { this.position = position; });
    }
    logout(){ this.user.logout(); return false; }
}