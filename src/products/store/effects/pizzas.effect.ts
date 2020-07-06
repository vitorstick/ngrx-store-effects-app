import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/Observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromServices from '../../services';
import * as pizzaActions from '../actions/pizzas.actions';

@Injectable()
export class PizzasEffects {
	constructor(private actions$: Actions, private pizzaService: fromServices.PizzasService) {}

	// EFFECTS RETURN ACTIONS
	@Effect()
	loadPizzas$ = this.actions$.ofType(pizzaActions.LOAD_PIZZAS).pipe(
		switchMap(() => {
			return this.pizzaService
				.getPizzas()
				.pipe(
					map((pizzas) => new pizzaActions.LoadPizzasSuccess(pizzas)),
					catchError((error) => of(new pizzaActions.LoadPizzasFail(error)))
				);
		})
	);

	@Effect()
	createPizza$ = this.actions$.ofType(pizzaActions.CREATE_PIZZA).pipe(
		map((action: pizzaActions.CreatePizza) => action.payload),
		switchMap((pizza) => {
			return this.pizzaService
				.createPizza(pizza)
				.pipe(
					map((pizza) => new pizzaActions.CreatePizzaSuccess(pizza)),
					catchError((error) => of(new pizzaActions.CreatePizzaFail(error)))
				);
		})
	);
}
