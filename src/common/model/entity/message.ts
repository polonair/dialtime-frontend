import { MessageRepository } from '../repository/';
import { Entity } from './entity';

export class Message extends Entity<MessageRepository>{
	public created;
	public text;
    update(){ super.update('message.get'); }
    parse(data: any){
    	this.created = new Date(data.created*1000);
    	this.text = data.text;
        this.readiness = true;
    } 
}
