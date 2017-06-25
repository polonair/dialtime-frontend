import { 
    Component, 
} from '@angular/core';
import { NGMeta } from "ngmeta";

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
