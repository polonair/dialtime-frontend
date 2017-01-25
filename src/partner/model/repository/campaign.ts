import { Repository } from './repository';
import { DataRepository } from './data.repository';

import { Campaign }  from '../entity';

export class CampaignRepository extends Repository{
    private campaigns_by_id = {};
    private campaigns = [];
    get(args){
        if (args[0] == '*' || args[0] == 'all') return this.campaigns;
        else{
            let result = [];
            for (let id of args){
                let _id = '_campaign_' + id;
                if (_id in this.campaigns_by_id) result.push(this.campaigns_by_id[_id]);
                else{
                    let category = new Campaign(this, id);
                    this.campaigns_by_id[_id] = category;
                    this.campaigns.push(category);
                    result.push(category);
                    category.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){
        for (let id of ids){
            let _id = '_campaign_' + id;
            if (_id in this.campaigns_by_id) (<Campaign>this.campaigns_by_id[_id]).update();
            else {
                let offer = new Campaign(this, id);
                this.campaigns_by_id[_id] = offer;
                this.campaigns.push(offer);
                offer.update();
            }
        }
    }
    create(args){
        this.dataRepository.api.doRequest({action:"campaign.create", data: args}).then((res: any) => {
            if (res.result == "ok") this.dataRepository.forceUpdate();
        });
    }
}
