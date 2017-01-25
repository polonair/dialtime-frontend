import { Injectable } from '@angular/core';
import { Router  } from '@angular/router';
import { CanActivate } from '@angular/router';
import * as services from './';

@Injectable()
export class LoggedOutGuard implements CanActivate {
	constructor(private user: services.UserService, private router: Router) {}
	canActivate() { 
		return this.user.isLoggedIn().then(res => { if (res) this.router.navigate(['/dashboard']); return !res; }); 
	}
}
