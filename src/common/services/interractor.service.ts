import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InterractorService {
	lastTitle: Subject<string> = new Subject<string>();
	set title(title: string){ this.lastTitle.next(title); }
}
