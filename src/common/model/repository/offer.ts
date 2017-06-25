import * as model from '../';
import { Repository } from './repository';

export class OfferRepository extends Repository{
    private offers_by_id = {};
    private offers = [];
    public ready = false;
    constructor(repo: model.DataRepository) { super(repo); }
    get(args){
        if (args[0] == '*' || args[0] == 'all') return this.offers;
        else{
            let result = [];
            for (let id of args){
                let _id = '_offer_' + id;
                if (_id in this.offers_by_id) result.push(this.offers_by_id[_id]);
                else{
                    let category = new model.Offer(this, id);
                    this.offers_by_id[_id] = category;
                    this.offers.push(category);
                    result.push(category);
                    category.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){
        for (let id of ids){
            let _id = '_offer_' + id;
            if (_id in this.offers_by_id) (<model.Offer>this.offers_by_id[_id]).update();
            else {
                let offer = new model.Offer(this, id);
                this.offers_by_id[_id] = offer;
                this.offers.push(offer);
                offer.update();
            }
        }
        this.ready = true;
    }
    create(args){
        this.dataRepository.api.doRequest({action:"offer.create", data: args}).then((r: any) => {
            let res = r;
            if (res.result == "ok") this.dataRepository.forceUpdate();
        });
    }
    isReady(){
        return this.ready;
    }
}

