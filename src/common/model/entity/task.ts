import { TaskRepository } from '../repository/';
import { Entity } from './entity';

export class Task extends Entity<TaskRepository>{
    public rate: number;
    parse(data: any){
        this.rate = data.rate;
        this.readiness = true;
    }
    update(){ super.update("task.get"); }
    ready(){ return (this.readiness); }
}