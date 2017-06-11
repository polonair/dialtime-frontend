import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { NGMeta } from "ngmeta";
import { Router } from '@angular/router';

import * as services from '../services/';
import * as model from '../model/';
import * as settings from '../app.settings';

@Component({
    selector: 'tc-app',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent { }

@Component({
    selector: 'tc-landing',
    template:
    `
    <tc-logo></tc-logo>
    <tc-label>Осталось совсем немного</tc-label>
    `
})
export class LandingComponent { 
    constructor(private ngmeta: NGMeta){
        this.ngmeta.setHead({ title: 'TargetCall' });
    }
}

@Component({
    selector: 'tc-auth-login',
    template:
    `
    <tc-login-box>
        <tc-logo>
            <a routerLink="/"><i></i><i></i></a>
        </tc-logo>
        <tc-form>
            <form (submit)="submit(username.value, password.value, button)">
                <p>Вход в личный кабинет</p>
                <input type="text" placeholder="Номер телефона" value="{{reg}}" #username>
                <input type="password" #password>
                <button type="submit" #button>Вход</button>
                <tc-links>
                    <tc-recover><a routerLink="/auth/recover">Забыли пароль?</a></tc-recover>
                    <tc-register><a routerLink="/auth/register">Зарегистрироваться</a></tc-register>
                </tc-links>
            </form>
        </tc-form>
    </tc-login-box>
    `
})
export class LoginComponent extends OnInit { 
    private reg = "";

    constructor(private ngmeta: NGMeta, private user: services.UserService, private router: Router){
        super();
        this.ngmeta.setHead({ title: 'TargetCall | Вход в личный кабинет' });
    }
    submit(username, password, button){
    	button.innerText="Подождите...";
    	button.disabled = true;

    	this.user.login(username, password).then((result) => {
    		if (result) {
    			this.router.navigate(['/dashboard']);
    		}
    		else{
    			button.innerText="Вход";
    			button.disabled = false;
    		}
    	});
    	return false;
    }
    ngOnInit()
    {
        this.reg = this.user.just_registered;
    }
}

@Component({
    selector: 'tc-auth-register',
    template:
    `
    <tc-register-box>
        <tc-logo>
            <a routerLink="/"><i></i><i></i></a>
        </tc-logo>
        <tc-form>
            <form (submit)="submit(username.value, button)">
                <p>Регистрация в личном кабинете</p>
                <p>Введите номер вашего мобильного телефона</p>
                <input type="text" placeholder="Номер телефона" #username>
                <button type="submit" #button>Регистрация</button>
                <tc-links>
                    <tc-recover><a routerLink="/auth/recover">Забыли пароль?</a></tc-recover>
                    <tc-register><a routerLink="/auth/login">Я уже зарегистрирован</a></tc-register>
                </tc-links>
            </form>
        </tc-form>
    </tc-register-box>
    `
})
export class RegisterComponent {  
    constructor(private ngmeta: NGMeta, private user: services.UserService, private router: Router){
        this.ngmeta.setHead({ title: 'TargetCall | Регистрация' });
    }
    submit(username, button){
        button.innerText="Подождите...";
        button.disabled = true;

        this.user.register(username).then((result) => {
            if (result) {
                this.router.navigate(['/auth/login']);
            }
            else{
                button.innerText="Регистрация";
                button.disabled = false;
            }
        });
        return false;
    }
}

@Component({
    selector: 'tc-dashboard',
    template:
    `
    <tc-header>
        <tc-wrapper>
            <tc-logo><a routerLink="/"><i></i><i></i></a></tc-logo>
            <tc-head>{{ title }}</tc-head>
            <tc-navigation></tc-navigation>
        </tc-wrapper>
    </tc-header>
    <tc-content>
        <tc-wrapper>
            <router-outlet></router-outlet>
        </tc-wrapper>
    </tc-content>
    <tc-footer>
        <tc-wrapper>
            &copy; TargetCall, 2014-2017
        </tc-wrapper>
    </tc-footer>    
    `
})
export class DashboardComponent{
    private title: string = "...";
    constructor(
        private ngmeta: NGMeta,
        private user: services.UserService, 
        private router: Router,
        private interractor: services.InterractorService) {
        this.interractor.lastTitle.subscribe(title => {
            this.title = title;
            //this.ngmeta.setMeta("name", "theme-color", settings.THEME_COLOR );
            this.ngmeta.createMeta({attribute: "name", type: "theme-color", content: settings.THEME_COLOR });
            this.ngmeta.setHead({ title: 'TargetCall | ' + this.title });
        });
    }
    logout(){
        this.user.logout().then(() => { this.router.navigate(['/auth/login']); });
        return false;
    }
}

@Component({
    selector: 'tc-navigation',
    template:
    `
    <tc-container tabindex="0">
        <tc-expander></tc-expander>
        <tc-menu>
            <tc-collapser></tc-collapser>
            <a routerLink="/dashboard">Предложения</a>
            <a routerLink="/dashboard/calls">Журнал звонков</a>
            <a routerLink="/dashboard/routes">Контакты</a>
            <a routerLink="/dashboard/finance">Финансы</a>
            <a href="#" (click)="logout()">Выход</a>
        </tc-menu>
    </tc-container>
    `
})
export class Navigation{
    constructor(private user: services.UserService){}
    logout(){ this.user.logout(); return false; }
}

@Component({
    selector: 'tc-offers',
    template:
    `
    <tc-placeholder *ngIf="showPlaceholder()"></tc-placeholder>
    <tc-nothing *ngIf="showNothing()">пусто</tc-nothing>
    <tc-offer-list [offers]="offers" #list></tc-offer-list>
    <tc-new-offer #new_offer></tc-new-offer>
    <tc-new-offer-button (click)="new_offer.toggle()"></tc-new-offer-button>
    `
})
export class OffersComponent implements OnInit {
    private offers: model.Offer[] = null;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Предложения';
        this.offers = <model.Offer[]>this.datarepo.get('offer', ['*']);
    }
    showPlaceholder(){ return !this.datarepo.isReady('offer'); }
    showNothing(){ return (this.datarepo.isReady('offer') && (this.offers.length < 1)); }    
}

@Component({
    selector: 'tc-new-offer',
    template:
    `
    <tc-container [class.shown]="expanded">
        <form (submit)="submit(ask.value, from_dow.value, to_dow.value, from_tod.value, to_tod.value, tz.value)">
            <tc-category-select>
                <span>Выберите категорию услуги</span>
                <span>
                    <tc-select *ngFor="let cat_level of cat_levels">
                        <select  *ngIf="cat_level.length > 0" (change)="cat_select_changed(cat_level, $event)">
                            <option selected disabled hidden style='display: none' value=''></option>
                            <option  *ngFor="let category of cat_level" value="{{category.id}}">
                                {{category.name}}
                            </option>
                        </select>
                    </tc-select>
                </span>
            </tc-category-select>
            <tc-location-select>
                <span>Выберите регион, в котором Вы собираетесь оказывать выбранную услугу</span>
                <span>
                    <tc-select *ngFor="let loc_level of loc_levels">
                        <select  *ngIf="loc_level.length > 0" (change)="loc_select_changed(loc_level, $event)">
                            <option selected disabled hidden style='display: none' value=''></option>
                            <option  *ngFor="let location of loc_level" value="{{location.id}}">
                                {{location.name}}
                            </option>
                        </select>
                    </tc-select>
                </span>
            </tc-location-select>
            <tc-ask-edit>
                <span>Укажите максимальную цену, которую вы готовы отдать за целевой звонок</span>
                <span>
                    <input type="text" #ask>
                </span>
            </tc-ask-edit>
            <tc-schedule-setup>
                <span>Укажите дни недели и время, когда Вы хотите получать звонки</span>
                <span>
                    <select #from_dow><option value="0">С понедельника</option><option value="1">Со вторника</option><option value="2">Со среды</option><option value="3">С четверга</option><option value="4">С пятницы</option><option value="5">С субботы</option><option value="6">С воскресенья</option></select>
                    <select #to_dow><option value="0">по понедельник</option><option value="1">по вторник</option><option value="2">по среду</option><option value="3">по четверг</option><option value="4">по пятницу</option><option value="5">по субботу</option><option value="6">по воскресенье</option></select>
                    <select #from_tod><option value="0">C 00:00</option><option value="1">C 01:00</option><option value="2">C 02:00</option><option value="3">C 03:00</option><option value="4">C 04:00</option><option value="5">C 05:00</option><option value="6">C 06:00</option><option value="7">C 07:00</option><option value="8">C 08:00</option><option value="9">C 09:00</option><option value="10">C 10:00</option><option value="11">C 11:00</option><option value="12">C 12:00</option><option value="13">C 13:00</option><option value="14">C 14:00</option><option value="15">C 15:00</option><option value="16">C 16:00</option><option value="17">C 17:00</option><option value="18">C 18:00</option><option value="19">C 19:00</option><option value="20">C 20:00</option><option value="21">C 21:00</option><option value="22">C 22:00</option><option value="23">C 23:00</option></select>
                    <select #to_tod><option value="0">до 00:59</option><option value="1">до 01:59</option><option value="2">до 02:59</option><option value="3">до 03:59</option><option value="4">до 04:59</option><option value="5">до 05:59</option><option value="6">до 06:59</option><option value="7">до 07:59</option><option value="8">до 08:59</option><option value="9">до 09:59</option><option value="10">до 10:59</option><option value="11">до 11:59</option><option value="12">до 12:59</option><option value="13">до 13:59</option><option value="14">до 14:59</option><option value="15">до 15:59</option><option value="16">до 16:59</option><option value="17">до 17:59</option><option value="18">до 18:59</option><option value="19">до 19:59</option><option value="20">до 20:59</option><option value="21">до 21:59</option><option value="22">до 22:59</option><option value="23">до 23:59</option></select>
                    <select #tz><option value="120">Калининградское время, KALT (MSK–1)</option><option value="180">Московское время, MSK</option><option value="240">Самарское время, SAMT (MSK+1)</option><option value="300">Екатеринбургское время, YEKT (MSK+2)</option><option value="360">Омское время, OMST (MSK+3)</option><option value="420">Красноярское время, KRAT (MSK+4)</option><option value="480">Иркутское время, IRKT (MSK+5)</option><option value="540">Якутское время, YAKT (MSK+6)</option><option value="600">Владивостокское время, VLAT (MSK+7)</option><option value="660">Магаданское время, MAGT (MSK+8)</option><option value="720">Камчатское время, PETT (MSK+9)</option></select>
                </span>
            </tc-schedule-setup>
            <tc-button>
                <tc-ok (click)="submit(ask.value, from_dow.value, to_dow.value, from_tod.value, to_tod.value, tz.value)">
                    <tc-icon></tc-icon> Сохранить
                </tc-ok>
                <tc-cancel (click)="toggle()">
                    <tc-icon></tc-icon> Отмена
                </tc-cancel>
            </tc-button>
        </form>
    </tc-container>
    `
})
export class NewOfferComponent extends OnInit{
    private cat_levels = [];
    private category_selected = 0;
    private loc_levels = [];
    private location_selected = 0;
    private expanded = false;
    private cat_load_promise;
    private loc_load_promise;
    constructor(private datarepo: model.DataRepository){ super(); }
    toggle(){ this.expanded = !this.expanded; }
    submit(a, fd, td, ft, tt, tz){ 
        let c = this.category_selected;
        let l = this.location_selected;
        let s = {intervals: [], timezone: tz};
        if (td < fd) td += 7;
        if (tt < ft) { let t = tt; tt = ft; ft = t; }
        for (let i = fd; i <= td; i++){
            let d = i;
            if (i > 6) d = i - 7;
            s.intervals.push({ from: ft*60 + 1440*d, to: tt*60 + 1440*d - 1 });
        }
        let args = { category: c, location: l, ask: a, schedule: s };
        this.datarepo.create('offer', args);
        this.toggle();
        return false; 
    }
    ngOnInit(){
        let cat_root = this.datarepo.get('category', [1])[0];
        this.cat_load_promise = new Promise((resolve, reject) => {
            let waiter = ()=>{
                if (cat_root.ready()) resolve();
                else tmr = setTimeout(waiter, 500);
            };
            let tmr = setTimeout(waiter, 500); 
        }).then(() => { 
            this.cat_levels.push(this.datarepo.get('category', cat_root.children));
        });
        let loc_root = this.datarepo.get('location', [1])[0];
        this.loc_load_promise = new Promise((resolve, reject) => {
            let waiter = ()=>{
                if (loc_root.ready()) resolve();
                else tmr = setTimeout(waiter, 500);
            };
            let tmr = setTimeout(waiter, 500); 
        }).then(() => { 
            this.loc_levels.push(this.datarepo.get('location', loc_root.children));
        });
    }
    cat_select_changed(cat_level, event){
        let idx = this.cat_levels.indexOf(cat_level);
        this.cat_levels.splice(idx, this.cat_levels.length - idx - 1);
        let sel = this.datarepo.get('category', [event.target.value])[0];
        this.cat_levels.push(this.datarepo.get('category', sel.children));
        this.category_selected = event.target.value;
    }
    loc_select_changed(loc_level, event){
        let idx = this.loc_levels.indexOf(loc_level);
        this.loc_levels.splice(idx, this.loc_levels.length - idx - 1);
        let sel = this.datarepo.get('location', [event.target.value])[0];
        this.loc_levels.push(this.datarepo.get('location', sel.children));
        this.location_selected = event.target.value;
    }
}

@Component({
    selector: 'tc-offer-list',
    template:
    `
    <tc-offer-item *ngFor="let offer of offers" [offer]="offer"></tc-offer-item>
    `
})
export class OfferListComponent {
    @Input() offers: model.Offer[] = [];
    insert(offer: model.Offer){
        this.offers.push(offer);
    }
}

@Component({
    selector: 'tc-offer-item',
    template:
    `
    <tc-item-container *ngIf="(offer == 'undefined') || (offer == null) || (offer && !offer.ready()) || (offer && offer.ready() && !offer.removed)">
        <tc-placeholder *ngIf="(offer == 'undefined') || (offer == null) || (offer && !offer.ready())"></tc-placeholder>
        <tc-container *ngIf="offer && offer.ready()" #container>
            <tc-control [class.expanded]="expanded">
                <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
                <tc-id>#{{ offer.id }}</tc-id>
                <tc-head (click)="toggle(container)">
                    <tc-text>{{ offer.category.name }}<br/>{{ offer.location.locative }}</tc-text>
                    <tc-progress><tc-bar [style.width]="getOfferTaskRate()"></tc-bar></tc-progress>
                </tc-head>
            </tc-control>
            <tc-body [class.expanded]="expanded">
                <tc-buttons class="{{ getIcon() }}">
                    <tc-remove (click)="remove()"></tc-remove>
                    <tc-splitter></tc-splitter>
                    <tc-repeat (click)="set_state('auto')"></tc-repeat>
                    <tc-play (click)="set_state('on')"></tc-play>
                    <tc-pause (click)="set_state('off')"></tc-pause>
                </tc-buttons>
                <tc-brief>
                	<tc-category>
                		<span>Категория </span>
                		<span>{{ offer.category.name }}</span>
                	</tc-category>
                	<tc-location>
                		<span>Регион </span>
                		<span>{{ offer.location.name }}</span>
                	</tc-location>
                	<tc-ask>
                		<span>Цена </span>
                		<span>
                            <tc-show [class.shown]="!ask_edit" (click)="toggle_ask()">
                                <span>до {{ offer.ask }} руб.</span>
                                <tc-pencil></tc-pencil>
                            </tc-show>
                            <tc-edit [class.shown]="ask_edit">
                                <input type="text" value="{{ offer.ask }}" #askInput>
                                <tc-buttons>
                                    <tc-ok (click)="save_ask(askInput.value)">
                                        <tc-icon></tc-icon> Сохранить
                                    </tc-ok>
                                    <tc-cancel (click)="toggle_ask()">
                                        <tc-icon></tc-icon> Отмена
                                    </tc-cancel>
                                </tc-buttons>
                            </tc-edit>
                        </span>
                    </tc-ask>
                	<tc-schedule>
                		<span>Расписание </span>
                        <span>
                            <tc-show [class.shown]="!sch_edit" (click)="toggle_sch()">
                                <span>{{ offer.schedule.toString() }}</span>
                                <tc-pencil></tc-pencil>
                            </tc-show>
                            <tc-edit [class.shown]="sch_edit">
                                <tc-selects>
                                    <select #from_dow><option value="0">С понедельника</option><option value="1">Со вторника</option><option value="2">Со среды</option><option value="3">С четверга</option><option value="4">С пятницы</option><option value="5">С субботы</option><option value="6">С воскресенья</option></select>
                                    <select #to_dow><option value="0">по понедельник</option><option value="1">по вторник</option><option value="2">по среду</option><option value="3">по четверг</option><option value="4">по пятницу</option><option value="5">по субботу</option><option value="6">по воскресенье</option></select>
                                    <select #from_tod><option value="0">C 00:00</option><option value="1">C 01:00</option><option value="2">C 02:00</option><option value="3">C 03:00</option><option value="4">C 04:00</option><option value="5">C 05:00</option><option value="6">C 06:00</option><option value="7">C 07:00</option><option value="8">C 08:00</option><option value="9">C 09:00</option><option value="10">C 10:00</option><option value="11">C 11:00</option><option value="12">C 12:00</option><option value="13">C 13:00</option><option value="14">C 14:00</option><option value="15">C 15:00</option><option value="16">C 16:00</option><option value="17">C 17:00</option><option value="18">C 18:00</option><option value="19">C 19:00</option><option value="20">C 20:00</option><option value="21">C 21:00</option><option value="22">C 22:00</option><option value="23">C 23:00</option></select>
                                    <select #to_tod><option value="0">до 00:59</option><option value="1">до 01:59</option><option value="2">до 02:59</option><option value="3">до 03:59</option><option value="4">до 04:59</option><option value="5">до 05:59</option><option value="6">до 06:59</option><option value="7">до 07:59</option><option value="8">до 08:59</option><option value="9">до 09:59</option><option value="10">до 10:59</option><option value="11">до 11:59</option><option value="12">до 12:59</option><option value="13">до 13:59</option><option value="14">до 14:59</option><option value="15">до 15:59</option><option value="16">до 16:59</option><option value="17">до 17:59</option><option value="18">до 18:59</option><option value="19">до 19:59</option><option value="20">до 20:59</option><option value="21">до 21:59</option><option value="22">до 22:59</option><option value="23">до 23:59</option></select>
                                    <select #tz><option value="120">Калининградское время, KALT (MSK–1)</option><option value="180">Московское время, MSK</option><option value="240">Самарское время, SAMT (MSK+1)</option><option value="300">Екатеринбургское время, YEKT (MSK+2)</option><option value="360">Омское время, OMST (MSK+3)</option><option value="420">Красноярское время, KRAT (MSK+4)</option><option value="480">Иркутское время, IRKT (MSK+5)</option><option value="540">Якутское время, YAKT (MSK+6)</option><option value="600">Владивостокское время, VLAT (MSK+7)</option><option value="660">Магаданское время, MAGT (MSK+8)</option><option value="720">Камчатское время, PETT (MSK+9)</option></select>
                                </tc-selects>
                                <tc-buttons>
                                    <tc-ok (click)="save_sch(from_dow.value, to_dow.value, from_tod.value, to_tod.value, tz.value)">
                                        <tc-icon></tc-icon> Сохранить
                                    </tc-ok>
                                    <tc-cancel (click)="toggle_sch()">
                                        <tc-icon></tc-icon> Отмена                                
                                    </tc-cancel>
                                </tc-buttons>
                            </tc-edit>
                        </span>
                	</tc-schedule>
                </tc-brief>
                <!-- tc-call-list>
                    <tc-call-item>
                        <tc-direction>3</tc-direction>
                        <tc-datetime>3</tc-datetime>
                        <tc-cost>3</tc-cost>
                        <tc-length>3</tc-length>
                    </tc-call-item>
                </tc-call-list -->
            </tc-body>
        </tc-container>
    </tc-item-container>
    `
})
export class OfferItemComponent {
	private expanded = false;
    private ask_edit = false;
    private sch_edit = false;
    @Input() offer: model.Offer;
    toggle(container){
    	if (this.expanded){
    		this.expanded = false;
            this.ask_edit = false;
            this.sch_edit = false;
    	}
    	else this.expanded = true;
    }
    getOfferTaskRate(){
    	if (this.offer.task) return this.offer.task.rate*100 + '%';
    	else return '0%';
    }
    getIcon(){ return this.offer.state; }
    toggle_ask(){ 
        this.ask_edit = !this.ask_edit;
        if (this.ask_edit) this.sch_edit = false;
    }
    toggle_sch(){ 
        this.sch_edit = !this.sch_edit; 
        if (this.sch_edit) this.ask_edit = false;
    }
    save_ask(value){
        if (this.offer.ask != value) this.offer.setAsk(value);
        this.ask_edit = false;
    }
    save_sch(from_dow, to_dow, from_tod, to_tod, tz){
        if ((this.offer.schedule.from_dow != from_dow) || (this.offer.schedule.to_dow != to_dow) || (this.offer.schedule.from_tod != from_tod) || (this.offer.schedule.to_tod != to_tod) || (this.offer.schedule.timezone != tz)) {
            this.offer.schedule.setIntervals(from_dow, to_dow, from_tod, to_tod, tz);
        }
        this.sch_edit = false;
    }
    remove(){
        this.offer.remove();
    }
    set_state(state){
        if (this.offer.state != state) this.offer.setState(state);
    }
}

//-----------------------------------------------------------------------------------------

@Component({
	selector: 'tc-calls',
    template:
    `
    <tc-placeholder *ngIf="(calls == 'undefined') || (calls == null) || (calls.length < 1)"></tc-placeholder>
    <tc-call-list [calls]="calls" #list></tc-call-list>
    `
})
export class CallsComponent{
	private calls: model.Call[];
	private length = 20;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Журнал звонков';
    	this.calls = <model.Call[]>this.datarepo.get('call', ['~' + this.length]);
    } 
}


@Component({
    selector: 'tc-call-list',
    template:
    `
    <tc-call-item *ngFor="let call of calls" [call]="call"></tc-call-item>
    `
})
export class CallListComponent {
    @Input() calls: model.Call[] = [];
    insert(call: model.Call){
        this.calls.push(call);
    }
}

@Component({
    selector: 'tc-call-item',
    template:
    `
    <tc-placeholder *ngIf="(call == 'undefined') || (call == null) || (call && !call.ready())"></tc-placeholder>    
    <tc-container *ngIf="call && call.ready()">
    	<tc-icon class="{{ getIcon() }}"></tc-icon>
        <tc-head>
            <span>
                <tc-id>#{{ call.id }}</tc-id>
                <tc-created>{{ call.createdAt | date:"yyyy.MM.dd HH:mm:ss" }}</tc-created>
            </span>
            <span>
                <tc-number>+{{ call.route.number }}</tc-number>
                <tc-length>{{ call.length | date:"mm:ss" }}</tc-length>
            </span>
        </tc-head>
    </tc-container>
    `
})
export class CallItemComponent {
    @Input() call: model.Call;
    getIcon(){ return "income"; }
}

//-----------------------------------------------------------------------------------------

@Component({
	selector: 'tc-routes',
    template:
    `
    <tc-placeholder *ngIf="(routes == 'undefined') || (routes == null) || (routes.length < 1)"></tc-placeholder>
    <tc-route-list [routes]="routes" #list></tc-route-list>
    `
})
export class RoutesComponent{
	private routes: model.Route[];
	private length = 20;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Контакты';
    	this.routes = <model.Route[]>this.datarepo.get('route', ['~' + this.length]);
    } 
}


@Component({
    selector: 'tc-route-list',
    template:
    `
    <tc-route-item *ngFor="let route of routes" [route]="route"></tc-route-item>
    `
})
export class RouteListComponent {
    @Input() routes: model.Route[] = [];
    insert(route: model.Route){
        this.routes.push(route);
    }
}

@Component({
    selector: 'tc-route-item',
    template:
    `
    <tc-placeholder *ngIf="(route == 'undefined') || (route == null) || (route && !route.ready())"></tc-placeholder>    
    <tc-container *ngIf="route && route.ready()">
        <tc-control>
            <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
            <tc-head (click)="toggle()">
                <span>
                    <tc-id>#{{ route.id }}</tc-id>
                    <tc-created>{{ route.createdAt | date:"yyyy.MM.dd HH:mm:ss" }}</tc-created>
                </span>
                <span>
                    <tc-number>+{{ route.number }}</tc-number>
                </span>
            </tc-head>
        </tc-control>
        <tc-body [class.expanded]="expanded">
            <tc-buttons class="{{ getIcon() }}">
                <tc-remove></tc-remove>
                <tc-splitter></tc-splitter>
                <tc-blacklist></tc-blacklist>
                <tc-spam></tc-spam>
                <tc-reject></tc-reject>
            </tc-buttons>
            <tc-brief>
            	<tc-created>
            		<span>Получен </span>
            		<span>{{ route.createdAt | date:"yyyy.MM.dd HH:mm:ss" }}</span>
            	</tc-created>
            	<tc-offer-link>
            		<span>Предложение </span>
            		<span>{{ route.offer.category.name }} {{ route.offer.location.locative }}</span>
            	</tc-offer-link>
            	<tc-direct *ngIf="route.direct!=null">
            		<span>Прямой номер </span>
            		<span>{{ route.direct }}</span>
            	</tc-direct>
            	<tc-cost>
            		<span>Стоимость </span>
            		<span>{{ route.cost }} руб.</span>
            	</tc-cost>
            </tc-brief>
            <!-- tc-call-list>
                <tc-call-item>
                    <tc-direction>3</tc-direction>
                    <tc-datetime>3</tc-datetime>
                    <tc-cost>3</tc-cost>
                    <tc-length>3</tc-length>
                </tc-call-item>
            </tc-call-list -->
        </tc-body>
    </tc-container>
    `
})
export class RouteItemComponent {
	private expanded  = false;
    @Input() route: model.Route;
    toggle(){
    	this.expanded = !this.expanded;
    }
    getIcon(){
    	return this.route.state;
    }
}


//-----------------------------------------------------------------------------------------

@Component({
	selector: 'tc-finances',
    template:
    `
    <tc-account>
        <tc-placeholder *ngIf="(accounts == 'undefined') || (accounts == null) || (accounts.length < 1) || (accounts.length > 0 && (accounts[0] == null || !accounts[0].ready()))"></tc-placeholder>
        <tc-container *ngIf="accounts && accounts.length > 0 && accounts[0] && accounts[0].ready()">
            <tc-info (click)="toggle()">
                <tc-head>Текущее состояние счета #{{ accounts[0].id }}</tc-head>
                <tc-current>
                    <span>Баланс </span>
                    <span>{{ accounts[0].balance }} руб.</span>
                </tc-current>
                <tc-hold-in [class.shown]="accounts[0].holdin != 0">
                    <span>Ожидается поступление </span>
                    <span>{{ accounts[0].holdin }} руб.</span>
                </tc-hold-in>
                <tc-hold-out [class.shown]="accounts[0].holdout != 0">
                    <span>Ожидается списание </span>
                    <span>{{ accounts[0].holdout }} руб.</span>
                </tc-hold-out>
                <tc-credit [class.shown]="accounts[0].credit != 0">
                    <span>Кредитный лимит </span>
                    <span>{{ accounts[0].credit }} руб.</span>
                </tc-credit>
                <tc-link>Пополнить счет</tc-link>
            </tc-info>
            <tc-fillup [class.expanded]="expanded">
                <tc-amount>
                    <span>Введите сумму </span>
                    <input type="text" #amount>
                    <span>руб. </span>
                </tc-amount>
                <tc-buttons>
                    <tc-ok (click)="go(amount.value)"><tc-icon></tc-icon> Оплатить</tc-ok>
                    <tc-cancel (click)="toggle()"><tc-icon></tc-icon> Отмена</tc-cancel>
                </tc-buttons>
            </tc-fillup>
        </tc-container>
    </tc-account>
    <tc-placeholder *ngIf="showPlaceholder()"></tc-placeholder>
    <tc-nothing *ngIf="showNothing()">пусто</tc-nothing>
    <tc-transaction-list [transactions]="transactions" #list></tc-transaction-list>
    `
})
export class FinanceComponent{
	private transactions: model.Transaction[];
    private accounts: model.Account[];
	private length = 20;
    private expanded = false;
    private fillUpWindow = null;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Финансы';
    	this.transactions = <model.Transaction[]>this.datarepo.get('transaction', ['~' + this.length ]);
        this.accounts = <model.Account[]>this.datarepo.get('account', "main");
    }
    toggle(){
        this.expanded = !this.expanded;
    }
    go(value){
        this.datarepo.api.doRequest({action:"fillup.get.link", data: { amount: value, provider: "robokassa" }}).then((r: any)=>{
            if (r.result == 'ok'){
                this.toggle();
                this.fillUpWindow =  window.open(r.data.link);
            }
        });
    }
    showPlaceholder(){ return !this.datarepo.isReady('transaction'); }
    showNothing(){ return (this.datarepo.isReady('transaction') && (this.transactions.length < 1)); } 
}

@Component({
    selector: 'tc-transaction-list',
    template:
    `
    <tc-transaction-item *ngFor="let transaction of transactions" [transaction]="transaction"></tc-transaction-item>
    `
})
export class TransactionListComponent {
    @Input() transactions: model.Transaction[] = [];
    insert(transaction: model.Transaction){
        this.transactions.push(transaction);
    }
}

@Component({
    selector: 'tc-transaction-item',
    template:
    `
    <tc-placeholder *ngIf="(transaction == 'undefined') || (transaction == null) || (transaction && !transaction.ready())"></tc-placeholder>
    <tc-container *ngIf="transaction && transaction.ready()">
    	<tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
        <tc-head>
            <span>
                <tc-id>#{{ transaction.id }}/{{ transaction.trid }}</tc-id>
                <tc-time-open>{{ transaction.open | date:"yyyy.MM.dd HH:mm:ss" }}</tc-time-open>
            </span>
            <span>
                <tc-amount>{{ transaction.amount }} руб.</tc-amount>
            </span>
        </tc-head>
    </tc-container>
    `
})
export class TransactionItemComponent {
    @Input() transaction: model.Transaction;
    getIcon(){ return ""; }
}
