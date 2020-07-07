import { NavigationExtras } from '@angular/router';
import { Action } from '@ngrx/store';

export const GO = '[Router] GO';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';

export class Go implements Action {
	readonly type = GO;

	constructor(
		public payload: {
			path: any[];
			query?: Object;
			extras?: NavigationExtras;
		}
	) {}
}

export class Back implements Action {
	readonly type = BACK;
}

export class Forward implements Action {
	readonly type = FORWARD;
}

export type Actions = Go | Back | Forward;
