import { MessageRepository } from '../repository/';
import { Entity } from './entity';

export class Message extends Entity<MessageRepository>{
    update(){ super.update('message.get'); }
    parse(data: any){ this.readiness = true; } 
}
