import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router  } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import * as model from '../model/';

@Component({
    selector: 'tc-ticket-detail',
    template:
    `
    <tc-placeholder *ngIf="(ticket == 'undefined') || (ticket == null) || (ticket && !ticket.ready())"></tc-placeholder>    
    <tc-container *ngIf="ticket && ticket.ready()">
        <tc-head>
            <tc-theme>
                <span>#{{ ticket.id }}</span>
                <span>{{ ticket.theme }}</span>
            </tc-theme>
            <tc-close (click)="location.back()"></tc-close>
        </tc-head>
        <tc-body>
            <tc-info>
                <tc-created>
                    <span>Открыт</span>
                    <span>{{ ticket.created | date:"yyyy.MM.dd HH:mm:ss" }}</span>
                </tc-created>
                <tc-client>
                    <span>Клиент</span>
                    <span>#{{ ticket.client.id }} {{ ticket.client.name }}</span>
                </tc-client>
            </tc-info>
            <tc-demanding *ngIf="ticket.demanding !== null">
                <tc-label>Запрос номера</tc-label>
                <tc-switch [ngSwitch]="ticket.demanding.state">
                    <tc-case *ngSwitchCase="'WAIT'" class="wait">
                        <tc-select>
                            <select #select>
                                <option *ngFor="let dongle of ticket.demanding.suggested" value="{{ dongle.id }}">{{ dongle.number }}</option>
                            </select>
                        </tc-select>
                        <tc-buttons>
                            <tc-deny (click)="deny()"><tc-icon></tc-icon>Отказать</tc-deny>
                            <tc-resolve (click)="resolve(select.value)"><tc-icon></tc-icon>Предоставить номер</tc-resolve>
                        </tc-buttons>
                    </tc-case>
                    <tc-case *ngSwitchCase="'ACCEPTED'" class="accepted">
                        <tc-text><tc-icon></tc-icon><span>Выдан номер</span><span>{{ ticket.demanding.dongle.number }}</span></tc-text>
                    </tc-case>
                    <tc-case *ngSwitchCase="'DECLINED'" class="declined">
                        <tc-text>
                            <tc-icon></tc-icon>
                            <span>Отказано</span>
                        </tc-text>
                    </tc-case>
                </tc-switch>
            </tc-demanding>
        </tc-body>
    </tc-container>
    <tc-messages *ngIf="ticket && ticket.ready()">
        <tc-message *ngFor="let message of ticket.messages">
            <tc-container class="{{ getMessageClass(message) }}">
                <tc-id>#{{ message.id }}</tc-id>
                <tc-date>{{ message.created | date:"yyyy.MM.dd HH:mm:ss" }}</tc-date>
                <tc-text>{{ message.text }}</tc-text>
            </tc-container>
        </tc-message>
        <tc-compose>
            <tc-editor>
                <textarea #text></textarea>
            </tc-editor>
            <tc-buttons>
                <tc-close (click)="close()"><tc-icon></tc-icon>Закрыть тикет</tc-close>
                <tc-post (click)="post(text.value)"><tc-icon></tc-icon>Отправить</tc-post>
            </tc-buttons>
        </tc-compose>
    </tc-messages>
    `
})
export class TicketDetailComponent implements OnInit, OnDestroy {
	private sub: any;
	private ticket: model.Ticket;
	constructor(private route: ActivatedRoute, private datarepo: model.DataRepository, private location: Location) {}
	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			let id = +params['id'];
            this.ticket = this.datarepo.get('ticket', [ id ])[0];
		});
	}
	ngOnDestroy() {
		this.sub.unsubscribe();
	}
    resolve(did){
        this.datarepo.api.doRequest({ action: 'demanding.resolve', data: { ticket: this.ticket.demanding.id, dongle: did } }).then((r:any)=>{
            
        });
    }
    deny(){
        this.datarepo.api.doRequest({ action: 'demanding.deny', data: { ticket: this.ticket.demanding.id } }).then((r:any)=>{
            
        });
    }
	getIcon(){ return ""; };
	getClientStyle(){ return ""; }
    getMessageClass(message){ return ""; }
    post(text){}
    close(){}
    back(){}
}
