import { Component } from '@angular/core';
import { NGMeta } from "ngmeta";

@Component({
    selector: 'tc-auth-register',
    template:
    `
    <h1>Register</h1>
    `
})
export class RegisterComponent { 
    constructor(private ngmeta: NGMeta){
        this.ngmeta.setHead({ title: 'Register' });
    }
}
