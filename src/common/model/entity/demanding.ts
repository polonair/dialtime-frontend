import { DemandingRepository } from '../repository/';
import { Entity } from './entity';

export class Demanding extends Entity<DemandingRepository>{
	private state;
	private suggested = [];
	private dongle = null;
    update(){ super.update('demanding.get'); }
    parse(data: any){ 
    	this.state = data.state;
    	this.suggested.splice(0, this.suggested.length);
        this.suggested = this.suggested.concat(this.repo.dataRepository.get('dongle', data.suggested));
        if (data.dongle != null) this.dongle = this.repo.dataRepository.get('dongle', [data.dongle])[0];
        else this.dongle = null;
    	this.readiness = true; 
    } 
}
