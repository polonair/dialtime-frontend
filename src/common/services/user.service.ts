import { Injectable } from '@angular/core';
import { Router  } from '@angular/router';
import { Response } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import * as services from './';

@Injectable()
export class UserService {
    private loggedIn = false;
    private initialized = false;
    public just_registered = "";

    constructor(private api: services.ApiRequest, private cookies: CookieService, private router: Router) { }
    register(username){
        let tz = (new Date()).getTimezoneOffset();
        return this.api.request({ action: "register", data: { username: username, timezone: tz } }).then((response: Response) => {
            this.loggedIn = false;
            if (response.json().result == 'ok')
            {
                this.just_registered = response.json().data;

            }
            else
            {
                this.just_registered = username;
            }
            return (response.json().result == 'ok');
        });
    }
    login(username, password) {
    	return this.api.request({ action: "login", data: { username: username, password: password } }).then((response: Response) => {
    		this.loggedIn = (response.json().result == 'ok');
    		let d = new Date();
    		d.setDate(d.getDate() + 2);
    		this.cookies.put('AUTH', response.json().data, { expires: d });
    		return this.loggedIn;
    	});
    }
    logout() { 
    	return this.api.request({ action: "logout" }).then(() => { 
	    	this.loggedIn = false; 
	    	this.cookies.removeAll(); 
            this.router.navigate(['/dashboard']);
	    }); 
	}
    isLoggedIn() {
    	if (this.initialized) {
    		return new Promise((resolve, reject) => resolve()).then(() => { return this.loggedIn; });
    	}
    	else {
	    	return this.api.request({ action: "is.logged.in" }).then((response: Response) => {
	    		this.initialized = true;
	    		this.loggedIn = (response.json().result == 'yes');
	    		return this.loggedIn;
	    	}); // надо повесить catch
    	}
    }
}
