import { Component } from '@angular/core';
import { NGMeta } from "ngmeta";
import { Router } from '@angular/router';

import * as services from '../services';

@Component({
    selector: 'tc-auth-login',
    template:
    `
    <h1>Login</h1>
    <form (submit)="submit(username.value, password.value, button)">
    	<input type="text" #username>
    	<input type="password" #password>
    	<button type="submit" #button>Enter</button>
    </form>
    `
})
export class LoginComponent { 
    constructor(private ngmeta: NGMeta, private user: services.UserService, private router: Router){
        this.ngmeta.setHead({ title: 'Login' });
    }
    submit(username, password, button){
    	button.innerText="Wait...";
    	button.disabled = true;

    	this.user.login(username, password).then((result) => {
    		if (result) {
    			this.router.navigate(['/dashboard']);
    		}
    		else{
    			button.innerText="Enter";
    			button.disabled = false;
    		}
    	});
    	return false;
    }
}
