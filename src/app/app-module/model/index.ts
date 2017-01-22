import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';

import * as services from '../services/';

export class Route{
    public number;
    public createdAt;
    public offer = null;
    public direct;
    public cost;
    public state;
    private readiness = false;
    constructor(private repo: RouteRepository, public id: number){}
    update(){
        this.repo.dataRepository.api.doRequest({ action: "route.get", data: this.id}).then((r: any) => {
            let res = r;
            if (res.result == "ok") {
                this.number = res.data.number;
                this.createdAt = new Date(res.data.createdAt*1000);
                this.offer = this.repo.dataRepository.get('offer', [ res.data.offer ])[0];
                this.direct = res.data.direct;
                this.cost = res.data.cost;
                this.state = res.data.state;
                this.readiness = true;
            }          
        }).catch((r) => {
            this.update();
        });
    }
    ready(){
        return (this.offer !=null && this.offer.ready() && this.readiness);
    }
}

export class Call{
    public createdAt;
    public route;
    public length;
    private readiness = false;
    constructor(private repo: CallRepository, public id: number){}
    update(){
        this.repo.dataRepository.api.doRequest({ action: "call.get", data: this.id}).then((r: any) => {
            let res = r;
            if (res.result == "ok") {
                this.createdAt = new Date(res.data.createdAt*1000);
                this.route = this.repo.dataRepository.get('route', [ res.data.route ])[0];
                this.length = res.data.length*1000;
                this.readiness = true;
            }          
        }).catch((r) => {
            this.update();
        });
    }
    ready(){
        return (this.readiness && this.route.ready());
    }    
}

export class Transaction{
    public trid;
    public amount;
    public role;
    //public event;
    public open;
    //public hold;
    //public cancel;
    //public close;
    public status;
    private readiness = false;
    constructor(private repo: TransactionRepository, public id: number){}
    update(){
        this.repo.dataRepository.api.doRequest({ action: "transaction.get", data: this.id}).then((r: any) => {
            let res = r;
            if (res.result == "ok") {
                this.id = res.data.id;
                this.trid = res.data.trid;
                this.amount = res.data.amount;
                this.role = res.data.role;
                //this.event = res.data.event;
                this.open = new Date(res.data.open*1000);
                //this.hold = res.data.hold;//"hold" => $entry->getTransaction()->getHoldAt(),
                //this.cancel = res.data.cancel;//"cancel" => $entry->getTransaction()->getCancelAt(),
                //this.close = res.data.close;//"close" => $entry->getTransaction()->getCloseAt(),
                this.status = res.data.status;
                this.readiness = true;
            }          
        }).catch((r) => {
            this.update();
        });
    }
    ready(){
        return (this.readiness);
    }    
}

export class Schedule{
    public intervals;
    public timezone;
    public from_dow;
    public to_dow;
    public from_tod;
    public to_tod;
    private readiness = false;
    constructor(private repo: ScheduleRepository, public id: number){}
    update(){
        this.repo.dataRepository.api.doRequest({ action: "schedule.get", data: this.id}).then((r: any) => {
            let res = r;//.json();
            if (res.result == "ok") {
                this.intervals = res.data.intervals;
                this.parseIntervals();
                this.timezone = res.data.tz;
                this.readiness = true;
            }          
        }).catch((r) => {
            this.update();
        });
    }
    ready(){
        return (this.readiness);
    }
    setIntervals(from_dow, to_dow, from_tod, to_tod, tz){
        let set_intervals = (fd, td, ft, tt, tz)=>{
            this.repo.dataRepository.api.doRequest({ action: "schedule.set.intervals", data: { "schedule": this.id, "fd": fd, "td": td, "ft": ft, "tt": tt, "tz": tz }}).then((r: any) => {
                if (r.result == "ok") {
                    this.repo.dataRepository.forceUpdate();
                    this.readiness = false;
                }          
            }).catch((r) => { set_intervals(fd, td, ft, tt, tz); });
        };
        set_intervals(from_dow, to_dow, from_tod, to_tod, tz);        
    }
    parseIntervals(){
        this.intervals.sort((a: any, b: any)=>{ return a.from - b.from; });

        this.from_tod = Math.round((this.intervals[0].from%1440)/60);
        this.to_tod = Math.round((this.intervals[0].to%1440)/60)-1;

        let dows = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false ];

        for(let i in this.intervals){
            let day = Math.floor(this.intervals[i].from/1440);
            dows[day] = true;
            dows[day+7] = true;
        }

        let rgns = [];
        let rgn = null;

        for(let i in dows){
            if (rgn == null) rgn = { type: dows[i], from: i, to: i};
            else{
                if (rgn.type === dows[i]) rgn.to = i;
                else{
                    rgns.push(rgn);
                    rgn = { type: dows[i], from: i, to: i};
                }
            }
        }
        rgns.push(rgn);
        rgns.sort((a: any, b: any)=>{ 
            return (b.to - b.from) - (a.to - a.from); 
        });
        
        for(let i in rgns){
            if (rgns[i].type){
                this.from_dow = rgns[i].from;
                this.to_dow = rgns[i].to;
                break;
            }
        }
        if (this.from_dow > 6) this.from_dow -= 7;
        if (this.to_dow > 6) this.to_dow -= 7;
    }
    toString(){
        if (!this.readiness) return "...";
        let dows = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
        let tods_from = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
        let tods_to = ['00:59','01:59','02:59','03:59','04:59','05:59','06:59','07:59','08:59','09:59','10:59','11:59','12:59','13:59','14:59','15:59','16:59','17:59','18:59','19:59','20:59','21:59','22:59','23:59'];
        let result = dows[this.from_dow] + "-" + dows[this.to_dow] + ": " + tods_from[this.from_tod] + " - " + tods_to[this.to_tod] + "; ";

        switch(this.timezone)
        {
            case 120: result += " (MSK-1)"; break;
            case 180: result += " (MSK)"; break;
            case 240: result += " (MSK+1)"; break;
            case 300: result += " (MSK+2)"; break;
            case 360: result += " (MSK+3)"; break;
            case 420: result += " (MSK+4)"; break;
            case 480: result += " (MSK+5)"; break;
            case 540: result += " (MSK+6)"; break;
            case 600: result += " (MSK+7)"; break;
            case 660: result += " (MSK+8)"; break;
            case 720: result += " (MSK+9)"; break;
        }
        return result;
    }
}

export class Task{
    public rate: number;
    private readiness = false;
    constructor(private repo: TaskRepository, public id: number){}
    update(){
        this.repo.dataRepository.api.doRequest({ action: "task.get", data: this.id}).then((r: any) => {
            let res = r;//.json();
            if (res.result == "ok") {
                this.rate = res.data.rate;
                this.readiness = true;
            }          
        }).catch((r) => {
            this.update();
        });
    }
    ready(){
        return (this.readiness);
    }
}

export class Category{
    public name;
    public children;
    private readiness = false;
    constructor(private repo: CategoryRepository, public id: number){}
    update(){
        this.repo.dataRepository.api.doRequest({ action: "category.get", data: this.id}).then((r: any) => {
            let res = r;//.json();
            if (res.result == "ok") {
                this.name = res.data.name;
                this.children = res.data.children;
                this.readiness = true;
            }          
        }).catch((r) => {
            this.update();
        });
    }
    ready(){
        return (this.readiness);
    }
}

export class Location{
    public name;
    public children;
    public locative;
    private readiness = false;
    constructor(private repo: LocationRepository, public id: number){}
    update(){
        this.repo.dataRepository.api.doRequest({ action: "location.get", data: this.id}).then((r: any) => {
            let res = r;//.json();
            if (res.result == "ok") {
                this.name = res.data.name;
                this.locative = res.data.locative;
                this.children = res.data.children;
                this.readiness = true;
            }          
        }).catch((r) => {
            this.update();
        });
    }
    ready(){
        return (this.readiness);
    }
}

export class Offer{
    public state = '';
    public category: Category = null;
    public location: Location = null;
    public schedule: Schedule = null;
    public ask;
    public task: Task = null;
    public removed;
    private readiness = false;
    constructor(private repo: OfferRepository, public id: number){}
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
    update(){
        this.repo.dataRepository.api.doRequest({ action: "offer.get", data: this.id}).then((r: any) => {
            let res = r;//.json();
            if (res.result == "ok") {
                this.removed = res.data.removed;
                this.state = res.data.state;
                this.category = this.repo.dataRepository.get('category', [ res.data.category ])[0];
                this.location = this.repo.dataRepository.get('location', [ res.data.location ])[0];
                this.schedule = this.repo.dataRepository.get('schedule', [ res.data.schedule ])[0];
                this.ask = res.data.ask;
                this.task = (res.data.task!=0)?(this.repo.dataRepository.get('task', [ res.data.task ])[0]):(null);
                this.readiness = true;
            }          
        }).catch((r) => {
            this.update();
        });
    }
    ready(){
        return (this.readiness 
            && this.category.ready() 
            && this.location.ready() 
            && (this.task == null || (this.task != null && this.task.ready()))
            && this.schedule.ready() 
        );
    }
}

export interface IRepository{
    get(args);
    create?(args);
    ids(ids: number[]);
}

export class TransactionRepository implements IRepository{
    private transactions_by_id = {};
    private transactions: Transaction[] = [];
    private loaded: Transaction[] = [];
    private minlength = 0;
    constructor(public dataRepository: DataRepository) { }
    get(args){
        if (args[0][0] == '~'){
            let count = parseInt(args[0].substr(1));
            this.minlength=count;
            this.update_loaded();
            return this.loaded;
        }
    }
    ids(ids: number[]){
        let is_empty = (this.transactions.length == 0);
        if (ids.length > 0)
        {
            for (let id of ids){
                let _id = '_transaction_' + id;
                if (_id in this.transactions_by_id) (<Transaction>this.transactions_by_id[_id]).update();
                else {
                    let transaction = new Transaction(this, id);
                    this.transactions_by_id[_id] = transaction;
                    this.transactions.push(transaction);
                    if (!is_empty) transaction.update();
                }
            }
            this.transactions.sort((a: Transaction, b: Transaction)=>{ return b.id-a.id; });
            this.update_loaded();
        }
    }
    update_loaded(){
        this.loaded.length = 0;
        let i = 0;
        while(true){
            if (i>= this.transactions.length) break;
            let t: Transaction = this.transactions[i];
            if (i < this.minlength){
                this.loaded.push(t);
                if (!t.ready()) t.update();
            }
            else{
                if (t.ready()) this.loaded.push(t);
                else break;
            }
            i++;
        }
    }
}

export class OfferRepository implements IRepository{
    private offers_by_id = {};
    private offers = [];
    constructor(public dataRepository: DataRepository) { }
    get(args){
        if (args[0] == '*' || args[0] == 'all') return this.offers;
        else{
            let result = [];
            for (let id of args){
                let _id = '_offer_' + id;
                if (_id in this.offers_by_id) result.push(this.offers_by_id[_id]);
                else{
                    let category = new Offer(this, id);
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
            if (_id in this.offers_by_id) (<Offer>this.offers_by_id[_id]).update();
            else {
                let offer = new Offer(this, id);
                this.offers_by_id[_id] = offer;
                this.offers.push(offer);
                offer.update();
            }
        }
    }
    create(args){
        this.dataRepository.api.doRequest({action:"offer.create", data: args}).then((r: any) => {
            let res = r;
            if (res.result == "ok") this.dataRepository.forceUpdate();
        });
    }
}

export class RouteRepository{
    private routes_by_id = {};
    private routes: Route[] = [];
    private loaded: Route[] = [];
    private minlength = 0;
    constructor(public dataRepository: DataRepository) { }
    get(args){
        if (args[0][0] == '~'){
            let count = parseInt(args[0].substr(1));
            this.minlength=count;
            this.update_loaded();
            return this.loaded;
        }
        else{
            let result = [];
            for (let id of args){
                let _id = '_route_' + id;
                if (_id in this.routes_by_id){
                    let route = this.routes_by_id[_id];
                    if (!route.ready()) route.update();
                    result.push(route);
                }
                else{
                    let category = new Route(this, id);
                    this.routes_by_id[_id] = category;
                    this.routes.push(category);
                    result.push(category);
                    category.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){
        let is_empty = (this.routes.length == 0);
        if (ids.length > 0)
        {
            for (let id of ids){
                let _id = '_route_' + id;
                if (_id in this.routes_by_id) (<Route>this.routes_by_id[_id]).update();
                else {
                    let route = new Route(this, id);
                    this.routes_by_id[_id] = route;
                    this.routes.push(route);
                    if (!is_empty) route.update();
                }
            }
            this.routes.sort((a: Route, b: Route)=>{ return b.id-a.id; });
            this.update_loaded();
        }
    }
    update_loaded(){
        this.loaded.length = 0;
        let i = 0;
        while(true){
            if (i>= this.routes.length) break;
            let r: Route = this.routes[i];
            if (i < this.minlength){
                this.loaded.push(r);
                if (!r.ready()) r.update();
            }
            else{
                if (r.ready()) this.loaded.push(r);
                else break;
            }
            i++;
        }
    }    
}

export class CallRepository implements IRepository{
    private calls_by_id = {};
    private calls: Call[] = [];
    private loaded: Call[] = [];
    private minlength = 0;
    constructor(public dataRepository: DataRepository) { }
    get(args){
        if (args[0][0] == '~'){
            let count = parseInt(args[0].substr(1));
            this.minlength=count;
            this.update_loaded();
            return this.loaded;
        }
    }
    ids(ids: number[]){
        let is_empty = (this.calls.length == 0);
        if (ids.length > 0)
        {
            for (let id of ids){
                let _id = '_call_' + id;
                if (_id in this.calls_by_id) (<Call>this.calls_by_id[_id]).update();
                else {
                    let route = new Call(this, id);
                    this.calls_by_id[_id] = route;
                    this.calls.push(route);
                    if (!is_empty) route.update();
                }
            }
            this.calls.sort((a: Call, b: Call)=>{ return b.id-a.id; });
            this.update_loaded();
        }
    }
    update_loaded(){
        this.loaded.length = 0;
        let i = 0;
        while(true){
            if (i>= this.calls.length) break;
            let r: Call = this.calls[i];
            if (i < this.minlength){
                this.loaded.push(r);
                if (!r.ready()) r.update();
            }
            else{
                if (r.ready()) this.loaded.push(r);
                else break;
            }
            i++;
        }
    }  
}

export class CategoryRepository implements IRepository{
    private categories_by_id = {};
    private categories = [];
    constructor(public dataRepository: DataRepository) { }
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = '_category_' + id;
                if (_id in this.categories_by_id) result.push(this.categories_by_id[_id]);
                else{
                    let category = new Category(this, id);
                    this.categories_by_id[_id] = category;
                    this.categories.push(category);
                    result.push(category);
                    category.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){ }
}

export class LocationRepository implements IRepository{
    private locations_by_id = {};
    private locations = [];
    constructor(public dataRepository: DataRepository) { }
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = '_location_' + id;
                if (_id in this.locations_by_id) result.push(this.locations_by_id[_id]);
                else{
                    let location = new Location(this, id);
                    this.locations_by_id[_id] = location;
                    this.locations.push(location);
                    result.push(location);
                    location.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){ }
}

export class TaskRepository implements IRepository{
    private tasks_by_id = {};
    private tasks = [];
    constructor(public dataRepository: DataRepository) { }
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = '_task_' + id;
                if (_id in this.tasks_by_id) result.push(this.tasks_by_id[_id]);
                else result.push(null);
            }
            return result;
        }
    }
    ids(ids: number[]){
        for (let id of ids){
            let _id = '_task_' + id;
            if (_id in this.tasks_by_id) (<Task>this.tasks_by_id[_id]).update();
            else {
                let task = new Task(this, id);
                this.tasks_by_id[_id] = task;
                this.tasks.push(task);
                task.update();
            }
        }
    }
}

export class ScheduleRepository implements IRepository{
    private schedules_by_id = {};
    private schedules = [];
    constructor(public dataRepository: DataRepository) { }
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = '_schedule_' + id;
                if (_id in this.schedules_by_id) result.push(this.schedules_by_id[_id]);
                else result.push(null);
            }
            return result;
        }
    }
    ids(ids: number[]){
        for (let id of ids){
            let _id = '_schedule_' + id;
            if (_id in this.schedules_by_id) (<Schedule>this.schedules_by_id[_id]).update();
            else {
                let schedule = new Schedule(this, id);
                this.schedules_by_id[_id] = schedule;
                this.schedules.push(schedule);
                schedule.update();
            }
        }
    }
}

export class Account{
    public balance;
    public holdin;
    public holdout;
    public credit;
    private readiness = false;
    constructor(private repo: AccountRepository, public id: number){}
    update(){
        this.repo.dataRepository.api.doRequest({ action: "account.get", data: this.id}).then((r: any) => {
            let res = r;//.json();
            if (res.result == "ok") {
                this.balance = res.data.balance;
                this.holdin = res.data.holdin;
                this.holdout = res.data.holdout;
                this.credit = res.data.credit;
                this.readiness = true;
            }          
        }).catch((r) => {
            this.update();
        });
    }
    ready(){
        return (this.readiness);
    }
}

export class AccountRepository implements IRepository{
    private accounts_by_id = {};
    private accounts = [];
    constructor(public dataRepository: DataRepository) { }
    get(args){
        if (args == "main"){
            return this.accounts;
        }
    }
    ids(ids: number[]){
        for (let id of ids){
            let _id = '_account_' + id;
            if (_id in this.accounts_by_id) (<Account>this.accounts_by_id[_id]).update();
            else {
                let account = new Account(this, id);
                this.accounts_by_id[_id] = account;
                this.accounts.push(account);
                account.update();
            }
        }
    }
}

@Injectable()
export class DataRepository{
    public api: services.ApiRequest;
    private repos = {};
    private timer;
    private upcounter = 0;

    constructor(api: services.ApiRequest) { 
        this.api = api;
        this.repos['offer'] = new OfferRepository(this);
        this.repos['category'] = new CategoryRepository(this);
        this.repos['location'] = new LocationRepository(this);
        this.repos['task'] = new TaskRepository(this);
        this.repos['schedule'] = new ScheduleRepository(this);
        this.repos['call'] = new CallRepository(this);
        this.repos['route'] = new RouteRepository(this);
        this.repos['transaction'] = new TransactionRepository(this);
        this.repos['account'] = new AccountRepository(this);
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
                for (let entity in data.entities) (<IRepository>owner.repos[entity]).ids(data.entities[entity] as number[]);
            }
            owner.timer = setTimeout(owner.update, 30000, owner);
        }).catch(() => {
            if (owner.upcounter > 0) owner.timer = setTimeout(owner.update, 30000, owner);
            else owner.timer = setTimeout(owner.update, 1000, owner);
        });
    }
    get(entity, args){ return (<IRepository>this.repos[entity]).get(args); }
    create(entity, args){ return (<IRepository>this.repos[entity]).create(args); }
}
