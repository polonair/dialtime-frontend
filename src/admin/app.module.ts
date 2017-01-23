import { NgModule } from '@angular/core';

import * as components from './components/';

import './styles/main.scss';

@NgModule(
{
    imports: [ ],
    declarations: [ components.AppComponent ],
    bootstrap: [ components.AppComponent ],
    providers: [ ],
    schemas: [ ]
})
export class AppModule { }
