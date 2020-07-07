import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'core-js/fn/array';
import { Observable } from 'rxjs/Observable';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Pizza } from '../models/pizza.model';
import * as fromStore from '../store';

@Injectable()
export class PizzaExistsGuard implements CanActivate {
	constructor(private store: Store<fromStore.ProductsState>) {}

	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
		return this.checkStore().pipe(
			switchMap(() => {
				const id = route.params.pizzaId;
				return this.hasPizza(id);
			}),
			catchError(() => of(false))
		);
	}

	hasPizza(id: number): Observable<boolean> {
		return this.store
			.select(fromStore.getToppingsEntities)
			.pipe(map((entities: { [key: number]: Pizza }) => !!entities[id]), take(1));
	}

	checkStore(): Observable<boolean> {
		return this.store.select(fromStore.getPizzasLoaded).pipe(
			tap((loaded) => {
				if (!loaded) {
					this.store.dispatch(new fromStore.LoadPizzas());
				}
			}),
			filter((loaded) => loaded),
			take(1)
		);
	}
}
