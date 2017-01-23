import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import * as settings from '../app.settings';

import 'rxjs/add/operator/toPromise';

export class RqApi{
	public ready = false;
	public response = null;
	constructor(public data){}
}

@Injectable()
export class ApiRequest {
    private apiurl = settings.API_URL;
    private pool: any[] = [];
    private timer;
    private tout = 500;
	constructor(private http: Http, private cookies: CookieService) {
        this.timer = setTimeout(this.update, this.tout, this);
    }
	public request(data){
        let auth = this.cookies.get('AUTH');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json'); 
        headers.append('X-TC-Authkey', auth);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiurl, data, options).toPromise();
	}
	public doRequest(data){
		return new Promise((resolve, reject) => {
			let _timeout = 250;
			let cntr = 100;
			let rq = new RqApi(data);
			this.pool.push(rq);
			let waiter = ()=>{
				if (rq.ready) resolve(rq.response);
				else{
					if (cntr-- <= 0) reject(); 
					else tmr = setTimeout(waiter, _timeout);
				}
			};
			let tmr = setTimeout(waiter, _timeout);
		});
	}
	update(api: ApiRequest){
		if (api.pool.length > 0)
		{
			let _pool: RqApi[] = api.pool;
			api.pool = [];
			let data = [];
			for (let rq in _pool)
				data.push({ "rqid": rq, "request": _pool[rq].data });
			api.request(data).then((r: Response) => {
				let d = r.json();
				for (let idx in d){
					_pool[d[idx].rqid].response = d[idx].response;
					_pool[d[idx].rqid].ready = true;
				}
			});
		}
		api.timer = setTimeout(api.update, api.tout, api);
	}
}

@Injectable()
export class UserService {
    private loggedIn = false;
    private initialized = false;

    constructor(private api: ApiRequest, private cookies: CookieService, private router: Router) { }
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

@Injectable()
export class LoggedInGuard implements CanActivate {
	constructor(private user: UserService, private router: Router) {}
	canActivate() { 
		return this.user.isLoggedIn().then(res => { if (!res) this.router.navigate(['/auth/login']); return res; }); 
	}
}

@Injectable()
export class LoggedOutGuard implements CanActivate {
	constructor(private user: UserService, private router: Router) {}
	canActivate() { 
		return this.user.isLoggedIn().then(res => { if (res) this.router.navigate(['/dashboard']); return !res; }); 
	}
}


@Injectable()
export class InterractorService {
	lastTitle: Subject<string> = new Subject<string>();
	set title(title: string){ this.lastTitle.next(title); }
}