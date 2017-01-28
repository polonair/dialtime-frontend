import { NewClientRepository } from '../repository/';
import { Entity } from './entity';

export class NewClient extends Entity<NewClientRepository>{
	public username;
    update(){ super.update('newclient.get'); }
    parse(data: any){ 
    	this.username = data.username;
    	this.readiness = true; 
    }
    bindMe(){
    	this.repo.dataRepository.api.doRequest({action: 'bindme', data: this.id }).then((r: any) => {
    		if (r.result == "ok") {
    			this.readiness = false;
    			this.repo.dataRepository.forceUpdate();
    		}
    	});
    }
}
