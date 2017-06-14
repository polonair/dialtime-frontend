import { 
    Component, } from '@angular/core';
import { NGMeta } from "ngmeta";
import { Router } from '@angular/router';

import * as services from '../services';

@Component({
    selector: 'tc-auth-register',
    template:
    `
    <tc-register-box>
        <tc-logo>
            <a routerLink="/"><i></i><i></i></a>
        </tc-logo>
        <tc-form>
            <form (submit)="submit(username.value, button)">
                <p>Регистрация в личном кабинете</p>
                <p>Введите номер вашего мобильного телефона</p>
                <input type="text" placeholder="Номер телефона" #username>
                <button type="submit" #button>Регистрация</button>
                <tc-links>
                    <tc-recover><a routerLink="/auth/recover">Забыли пароль?</a></tc-recover>
                    <tc-register><a routerLink="/auth/login">Я уже зарегистрирован</a></tc-register>
                </tc-links>
            </form>
        </tc-form>
    </tc-register-box>
    `
})
export class RegisterComponent {  
    constructor(private ngmeta: NGMeta, private user: services.UserService, private router: Router){
        this.ngmeta.setHead({ title: 'TargetCall | Регистрация' });
    }
    submit(username, button){
        button.innerText="Подождите...";
        button.disabled = true;

        this.user.register(username).then((result) => {
            if (result) {
                this.router.navigate(['/auth/login']);
            }
            else{
                button.innerText="Регистрация";
                button.disabled = false;
            }
        });
        return false;
    }
}
