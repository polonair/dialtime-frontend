import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Repository } from './repository';

import * as services from '../../services';
import * as repository from './';

@Injectable()
export class DataRepository{
    public api: services.ApiRequest;
    private repos = {};
    private timer;
    private upcounter = 0;

    constructor(api: services.ApiRequest) { 
        this.api = api;
        this.repos['campaign'] = new repository.CampaignRepository(this);
        this.repos['category'] = new repository.CategoryRepository(this);
        this.repos['demanding'] = new repository.DemandingRepository(this);
        this.repos['dongle'] = new repository.DongleRepository(this);
        this.repos['location'] = new repository.LocationRepository(this);
        this.repos['message'] = new repository.MessageRepository(this);
        this.repos['partner'] = new repository.PartnerRepository(this);
        this.repos['route'] = new repository.RouteRepository(this);
        this.repos['ticket'] = new repository.TicketRepository(this);
        this.repos['transaction'] = new repository.TransactionRepository(this);
        this.timer = setTimeout(this.update, 1000, this);
    }
    forceUpdate(){
        clearTimeout(this.timer);
        this.timer = setTimeout(this.update, 100, this);
    }
    update(owner: DataRepository){
        owner.api.request({ action: "check", data: owner.upcounter }).then((r: Response) => {
            let res = r.json();
            if (res.result == "ok") {
                let data = res.data;
                owner.upcounter = data.counter;
                for (let entity in data.entities) (<Repository>owner.repos[entity]).ids(data.entities[entity] as number[]);
            }
            owner.timer = setTimeout(owner.update, 30000, owner);
        }).catch(() => {
            if (owner.upcounter > 0) owner.timer = setTimeout(owner.update, 30000, owner);
            else owner.timer = setTimeout(owner.update, 1000, owner);
        });
    }
    get(entity, args){ return (<Repository>this.repos[entity]).get(args); }
    create(entity, args){ return (<Repository>this.repos[entity]).create(args); }
    isReady(entity){ return (<Repository>this.repos[entity]).isReady(); }
}
