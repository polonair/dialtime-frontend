import { 
    Component, 
    OnInit, 
} from '@angular/core';

import * as model from '../model';


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