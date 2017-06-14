import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router  } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import * as services from '../services';
import * as model from '../model';

@Component({
    selector: 'tc-offer-details',
    template:
    `
    <tc-details-container *ngIf="(offer == 'undefined') || (offer == null) || (offer && !offer.ready()) || (offer && offer.ready() && !offer.removed)">
        <tc-placeholder *ngIf="(offer == 'undefined') || (offer == null) || (offer && !offer.ready())"></tc-placeholder>
        <tc-container *ngIf="offer && offer.ready()" #container>
            <tc-control class="expanded">
                <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
                <tc-id>#{{ offer.id }}</tc-id>
                <tc-head (click)="location.back()">
                    <tc-text>{{ offer.category.name }}<br/>{{ offer.location.locative }}</tc-text>
                    <tc-progress><tc-bar [style.width]="getOfferTaskRate()"></tc-bar></tc-progress>
                </tc-head>
            </tc-control>
            <tc-body class="expanded">
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
    </tc-details-container>        
    `
})
export class OfferDetailsComponent {
    private sub: any;
    private offer: model.Offer;
    constructor(
        private route: ActivatedRoute, 
        private datarepo: model.DataRepository, 
        private location: Location,        
        private interractor: services.InterractorService) {}
    ngOnInit(){
        this.interractor.title = 'Предложения';
        this.interractor.position = 'offers';
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id'];
            this.offer = this.datarepo.get('offer', [ id ])[0];
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    getIcon(){ return this.offer.state; } 
    getOfferTaskRate(){
        if (this.offer.task) return this.offer.task.rate*100 + '%';
        else return '0%';
    }
}