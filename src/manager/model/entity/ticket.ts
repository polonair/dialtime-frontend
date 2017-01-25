import { TicketRepository } from '../repository/';
import { Entity } from './entity';

export class Ticket extends Entity<TicketRepository>{
	public client;
	public theme;
	public state;
	public created;
	public demanding = null;
	public messages: any[];
    update(){ super.update('ticket.get'); }
    parse(data: any){
		this.client = data.client;
		this.theme = data.theme;
		this.state = data.state;
		this.created = new Date(data.created*1000);
		this.demanding = data.demanding;
		if (this.demanding != null) this.demanding  = this.repo.dataRepository.get('demanding', [ data.demanding ])[0];
		this.messages = this.repo.dataRepository.get('message', data.messages);
		this.client = this.repo.dataRepository.get('myclient', [ data.client ])[0];
    	this.readiness = true; 
    } 
}
