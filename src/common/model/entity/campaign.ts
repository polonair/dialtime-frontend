import { CampaignRepository } from '../repository/';
import { Entity } from './entity';

export class Campaign extends Entity<CampaignRepository>{
    public category;
    public location;
    public active_demandings = [];
    public dongles = [];
    public bid;
    ready(){ return (this.readiness && this.category.ready() && this.location.ready()); }
    update(){ super.update('campaign.get'); }
    parse(data: any){ 
        this.category = this.repo.dataRepository.get('category', [ data.category ])[0];
        this.location = this.repo.dataRepository.get('location', [ data.location ])[0];
        this.active_demandings.splice(0, this.active_demandings.length);
        this.active_demandings = this.active_demandings.concat(this.repo.dataRepository.get('demanding', data.active_demandings));
        this.dongles.splice(0, this.dongles.length);
        this.dongles = this.dongles.concat(this.repo.dataRepository.get('dongle', data.dongles));
        this.bid = data.bid;
        this.readiness = true;
    }
    demand(){
        this.repo.dataRepository.api.doRequest({ action: "demand", data: this.id }).then((r: any)=>{
            if (r.result == "ok") {
                this.readiness = false;
                this.update();
            }
        });
    }
}
