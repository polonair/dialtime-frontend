import { Component } from '@angular/core';
import { NGMeta } from "ngmeta";

@Component({
    selector: 'tc-landing',
    template:
    `
    <h1>Landing Page</h1>
    <p><a routerLink="/dashboard">Dashboard</a></p>
    `
})
export class LandingComponent { 
    constructor(private ngmeta: NGMeta){
        this.ngmeta.setHead({ title: 'Landing Page' });
    }
}
