import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/Observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store';
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

	// FOR MANAGING CREATE PIZZA WITH SUCCESS AND THEN NAVIGATE TO THE PIZZA
	@Effect()
	createPizzaSuccess$ = this.actions$.ofType(pizzaActions.CREATE_PIZZA_SUCESS).pipe(
		map((action: pizzaActions.CreatePizzaSuccess) => action.payload),
		map((pizza) => {
			return new fromRoot.Go({
				path: [ '/products', pizza.id ]
			});
		})
	);

	@Effect()
	updatePizza$ = this.actions$.ofType(pizzaActions.UPDATE_PIZZA).pipe(
		map((action: pizzaActions.UpdatePizza) => action.payload),
		switchMap((pizza) => {
			return this.pizzaService
				.updatePizza(pizza)
				.pipe(
					map((pizza) => new pizzaActions.UpdatePizzaSuccess(pizza)),
					catchError((error) => of(new pizzaActions.UpdatePizzaFail(error)))
				);
		})
	);

	@Effect()
	removePizza$ = this.actions$.ofType(pizzaActions.REMOVE_PIZZA).pipe(
		map((action: pizzaActions.RemovePizza) => action.payload),
		switchMap((pizza) => {
			return this.pizzaService
				.removePizza(pizza)
				.pipe(
					map(() => new pizzaActions.RemovePizzaSuccess(pizza)),
					catchError((error) => of(new pizzaActions.RemovePizzaFail(error)))
				);
		})
	);

	// EFFECT FOR MULTIPLE ACTIONS (THIS CASE FOR UPDATE PIZZA SUCCESS AND REMOVE PIZZA SUCCESS)
	@Effect()
	handlePizzaSuccess$ = this.actions$
		.ofType(pizzaActions.UPDATE_PIZZA_SUCCESS, pizzaActions.REMOVE_PIZZA_SUCCESS)
		.pipe(
			map((pizza) => {
				return new fromRoot.Go({
					path: [ '/products' ]
				});
			})
		);
}
