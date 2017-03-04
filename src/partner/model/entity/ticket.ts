import { TicketRepository } from '../repository/';
import { Entity } from './entity';

export class Ticket extends Entity<TicketRepository>{
    update(){ super.update('ticket.get'); }
    parse(data: any){ this.readiness = true; } 
}
