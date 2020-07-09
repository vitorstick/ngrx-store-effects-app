import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromServices from '../../services';
import * as toppingActions from '../actions/toppings.actions';

@Injectable()
export class ToppingEffects {
	constructor(private actions$: Actions, private toppingService: fromServices.ToppingsService) {}

	// EFFECTS RETURN ACTIONS
	@Effect()
	loadToppings$ = this.actions$.pipe(
		ofType(toppingActions.LOAD_TOPPINGS),
		switchMap(() => {
			return this.toppingService
				.getToppings()
				.pipe(
					map((toppings) => new toppingActions.LoadToppingsSuccess(toppings)),
					catchError((error) => of(new toppingActions.LoadToppingsFail(error)))
				);
		})
	);
}
