import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router  } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import * as services from '../services';
import * as model from '../model';

@Component({
    selector: 'tc-route-details',
    template:
    `
    <tc-placeholder *ngIf="(route == 'undefined') || (route == null) || (route && !route.ready())"></tc-placeholder>    
    <tc-container *ngIf="route && route.ready()">
        <tc-control>
            <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
            <tc-head (click)="location.back()">
                <span>
                    <tc-id>#{{ route.id }}</tc-id>
                    <tc-created>{{ route.createdAt | date:"yyyy.MM.dd HH:mm:ss" }}</tc-created>
                </span>
                <span>
                    <tc-number>+{{ route.number }}</tc-number>
                </span>
            </tc-head>
        </tc-control>
        <tc-body class="expanded">
            <tc-buttons class="{{ getIcon() }}">
                <tc-remove></tc-remove>
                <tc-splitter></tc-splitter>
                <tc-blacklist></tc-blacklist>
                <tc-spam (click)="reject('spam')"></tc-spam>
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
export class RouteDetailsComponent {
    private sub: any;
    private route: model.Route;
    constructor(
        private route_: ActivatedRoute, 
        private datarepo: model.DataRepository, 
        private location: Location,        
        private interractor: services.InterractorService) {}
    ngOnInit(){
        this.interractor.title = 'Контакты';
        this.interractor.position = 'routes';
        this.sub = this.route_.params.subscribe(params => {
            let id = +params['id'];
            this.route = this.datarepo.get('route', [ id ])[0];
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    getIcon(){ return this.route.state; } 
    reject(reason){
        this.route.reject(reason);
    }
}
/*
Удаление маршута - маршрут помещается в архив, деньги не возвращаются, 
МО сбрасывается, МТ восстанавливает маршрут с повторной оплатой 
по возможности на тот же номер. 
Маршрут может быть восстановлен из архива с повторной оплатой.

Помещение в черный список - маршрут помещается в архив, деньги возвращаются
после рассмотрения менеджером, МО и МТ сбрасываются. 
Маршрут может быть восстановлен с оплатой или без в зависимости от того 
были или нет возвращены деньги за этот маршрут менеджером.

Спам - маршрут помещается в архив, деньги возвращаются в случае, если менеджер
одобрил заявку на спам, МО сбрасывается, МТ на любой номер системы сбрасывается.
Маршрут не может быть восстановлен.

Отказ от маршрута - маршрут помещается в архив, деньги возвращаются
после рассмотрения менеджером, МО сбрасывается, МТ восстанавливает маршрут с повторной оплатой 
по возможности на тот же номер. 
Маршрут может быть восстановлен с оплатой или без в зависимости от того 
были или нет возвращены деньги за этот маршрут менеджером.


*/