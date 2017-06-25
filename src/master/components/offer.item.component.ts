import { 
    Component, 
    Input, 
} from '@angular/core';
import { Router } from '@angular/router';
import * as model from '../model';


@Component({
    selector: 'tc-offer-item',
    template:
    `
    <tc-item-container *ngIf="(offer == 'undefined') || (offer == null) || (offer && !offer.ready()) || (offer && offer.ready() && !offer.removed)">
        <tc-placeholder *ngIf="(offer == 'undefined') || (offer == null) || (offer && !offer.ready())"></tc-placeholder>
        <tc-container *ngIf="offer && offer.ready()" #container>
            <tc-control>
                <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
                <tc-id>#{{ offer.id }}</tc-id>
                <tc-head (click)="toggle(container)">
                    <tc-text>{{ offer.category.name }}<br/>{{ offer.location.locative }}</tc-text>
                    <tc-progress><tc-bar [style.width]="getOfferTaskRate()"></tc-bar></tc-progress>
                </tc-head>
            </tc-control>
        </tc-container>
    </tc-item-container>
    `
})
export class OfferItemComponent {
	private expanded = false;
    private ask_edit = false;
    private sch_edit = false;
    @Input() offer: model.Offer;
    constructor(private router: Router){}
    toggle(container){ this.router.navigate(['/dashboard/offer', this.offer.id]); }
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