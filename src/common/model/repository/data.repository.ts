import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';

import * as services from '../../services';
import * as model from '../';

@Injectable()
export class DataRepository{
    public api: services.ApiRequest;
    private repos = {};
    private timer;
    private upcounter = 0;

    constructor(api: services.ApiRequest) { 
        this.api = api;
        this.repos['account'] = new model.AccountRepository(this);
        this.repos['call'] = new model.CallRepository(this);
        this.repos['campaign'] = new model.CampaignRepository(this);
        this.repos['category'] = new model.CategoryRepository(this);
        this.repos['demanding'] = new model.DemandingRepository(this);
        this.repos['dongle'] = new model.DongleRepository(this);
        this.repos['location'] = new model.LocationRepository(this);
        this.repos['message'] = new model.MessageRepository(this);
        this.repos['offer'] = new model.OfferRepository(this);
        this.repos['partner'] = new model.PartnerRepository(this);
        this.repos['route'] = new model.RouteRepository(this);
        //?this.repos['route'] = new model.RouteRepository(this);
        this.repos['schedule'] = new model.ScheduleRepository(this);
        this.repos['task'] = new model.TaskRepository(this);
        this.repos['ticket'] = new model.TicketRepository(this);
        this.repos['transaction'] = new model.TransactionRepository(this);
        //?this.repos['transaction'] = new model.TransactionRepository(this);
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
                for (let entity in data.entities) (<model.Repository>owner.repos[entity]).ids(data.entities[entity] as number[]);
            }
            owner.timer = setTimeout(owner.update, 30000, owner);
        }).catch(() => {
            if (owner.upcounter > 0) owner.timer = setTimeout(owner.update, 30000, owner);
            else owner.timer = setTimeout(owner.update, 1000, owner);
        });
    }
    get(entity, args){ return (<model.Repository>this.repos[entity]).get(args); }
    getAll(entity){ return (<model.Repository>this.repos[entity]).getAll(); }
    getLast(entity, count){ return (<model.Repository>this.repos[entity]).getLast(count); }
    getLength(entity){ return (<model.Repository>this.repos[entity]).getLength(); }
    create(entity, args){ return (<model.Repository>this.repos[entity]).create(args); }
    isReady(entity){ return (<model.Repository>this.repos[entity]).isReady(); }
}