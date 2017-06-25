import { Component } from '@angular/core';
import { Input } from '@angular/core';

import * as model from '../model';

@Component({
    selector: 'tc-call-item',
    template:
    `
    {{ call.id  }}
    `
})
export class CallItemComponent {
    @Input() call: model.Route;
    getIcon(){ return "income"; }
}
