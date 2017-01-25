import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Response } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import 'rxjs/add/operator/toPromise';

class RqApi{
	public ready = false;
	public response = null;
	constructor(public data){}
}

@Injectable()
export class ApiRequest {
    private pool: any[] = [];
    private timer;
    private tout = 500;
    
	constructor(private http: Http, private cookies: CookieService, private apiurl) {
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
