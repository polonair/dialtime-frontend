import { MyClientRepository } from '../repository/';
import { Entity } from './entity';

export class MyClient extends Entity<MyClientRepository>{
	public username;
    update(){ super.update('myclient.get'); }
    parse(data: any){
    	this.username = data.username;    	
    	this.readiness = true;
    } 
}
