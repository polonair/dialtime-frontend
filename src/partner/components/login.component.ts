import { Component, OnInit } from '@angular/core';
import { NGMeta } from "ngmeta";
import { Router } from '@angular/router';

import * as services from '../services';

@Component({
    selector: 'tc-auth-login',
    template:
    `
    <tc-login-box>
        <tc-logo>
            <a routerLink="/"><i></i><i></i></a>
        </tc-logo>
        <tc-form>
            <form (submit)="submit(username.value, password.value, button)">
                <p>Вход в личный кабинет</p>
                <input type="text" placeholder="Номер телефона" value="{{reg}}" #username>
                <input type="password" #password>
                <button type="submit" #button>Вход</button>
                <tc-links>
                    <tc-recover><a routerLink="/auth/recover">Забыли пароль?</a></tc-recover>
                    <tc-register><a routerLink="/auth/register">Зарегистрироваться</a></tc-register>
                </tc-links>
            </form>
        </tc-form>
    </tc-login-box>
    `
})
export class LoginComponent extends OnInit { 
    private reg = "";
    
    constructor(private ngmeta: NGMeta, private user: services.UserService, private router: Router){
        super();
        this.ngmeta.setHead({ title: 'Login' });
    }
    submit(username, password, button){
        button.innerText="Подождите...";
        button.disabled = true;

        this.user.login(username, password).then((result) => {
            if (result) {
                this.router.navigate(['/dashboard']);
            }
            else{
                button.innerText="Вход";
                button.disabled = false;
            }
        });
        return false;
    }
    ngOnInit()
    {
        this.reg = this.user.just_registered;
    }
}
