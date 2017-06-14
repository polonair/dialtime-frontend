import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import * as model from '../model';

@Component({
    selector: 'tc-new-campaign',
    template:
    `
    <tc-container [class.shown]="expanded">
        <form (submit)="submit(bid.value)">
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
            <tc-bid-edit>
                <span>Укажите минимальную цену, которую вы готовы отдать за целевой звонок</span>
                <span>
                    <input type="text" #bid>
                </span>
            </tc-bid-edit>
            <tc-button>
                <tc-ok (click)="submit(bid.value)">
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
export class NewCampaignComponent extends OnInit{
    private cat_levels = [];
    private category_selected = 0;
    private loc_levels = [];
    private location_selected = 0;
    private expanded = false;
    private cat_load_promise;
    private loc_load_promise;
    constructor(private datarepo: model.DataRepository){ super(); }
    toggle(){ this.expanded = !this.expanded; }
    submit(a){ 
        let c = this.category_selected;
        let l = this.location_selected;
        let args = { category: c, location: l, ask: a };
        this.datarepo.create('campaign', args);
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