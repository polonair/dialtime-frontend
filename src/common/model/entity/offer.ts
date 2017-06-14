import { OfferRepository } from '../repository/';
import { Entity } from './entity';
import { Category, Location, Schedule, Task } from './';

export class Offer extends Entity<OfferRepository>{
    public state = '';
    public category: Category = null;
    public location: Location = null;
    public schedule: Schedule = null;
    public ask;
    public task: Task = null;
    public removed;
    parse(data: any){
        this.removed = data.removed;
        this.state = data.state;
        this.category = this.repo.dataRepository.get('category', [ data.category ])[0];
        this.location = this.repo.dataRepository.get('location', [ data.location ])[0];
        this.schedule = this.repo.dataRepository.get('schedule', [ data.schedule ])[0];
        this.ask = data.ask;
        this.task = (data.task!=0)?(this.repo.dataRepository.get('task', [ data.task ])[0]):(null);
        this.readiness = true;
    }
    setAsk(value: number){
        let set_ask = (v: number)=>{
            this.repo.dataRepository.api.doRequest({ action: "offer.set.ask", data: { "offer": this.id, "value": v }}).then((r: any) => {
                if (r.result == "ok") {
                    this.repo.dataRepository.forceUpdate();
                    this.readiness = false;
                }          
            }).catch((r) => { set_ask(v); });
        };
        set_ask(value);
    }
    setState(value: string){
        let set_state = (v: string)=>{
            this.repo.dataRepository.api.doRequest({ action: "offer.set.state", data: { "offer": this.id, "state": v }}).then((r: any) => {
                if (r.result == "ok") {
                    this.readiness = false;
                    this.repo.dataRepository.forceUpdate();
                }          
            }).catch((r) => { set_state(v); });
        };
        set_state(value);
    }
    remove(){
        let _remove = ()=>{
            this.repo.dataRepository.api.doRequest({ action: "offer.remove", data: { "offer": this.id }}).then((r: any) => {
                if (r.result == "ok") {
                    //this.repo.remove(this.id);
                    this.readiness = false;
                    this.repo.dataRepository.forceUpdate();
                }          
            }).catch((r) => { _remove(); });
        };
        _remove();
    }
    update(){ super.update("offer.get"); }
    ready(){
        return (this.readiness 
            && (this.category != null && this.category.ready())
            && (this.location != null && this.location.ready())
            && (this.task == null || (this.task != null && this.task.ready()))
            && (this.schedule != null && this.schedule.ready())
        );
    }
}
