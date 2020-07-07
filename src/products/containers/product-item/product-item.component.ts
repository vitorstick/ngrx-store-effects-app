import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Pizza } from '../../models/pizza.model';
import { Topping } from '../../models/topping.model';
import * as fromStore from '../../store';

@Component({
	selector: 'product-item',
	styleUrls: [ 'product-item.component.scss' ],
	template: `
    <div
      class="product-item">
      <pizza-form
        [pizza]="pizza$ | async"
        [toppings]="toppings$ | async"
        (selected)="onSelect($event)"
        (create)="onCreate($event)"
        (update)="onUpdate($event)"
        (remove)="onRemove($event)">
        <pizza-display
          [pizza]="visualise$ | async">
        </pizza-display>
      </pizza-form>
    </div>
  `
})
export class ProductItemComponent implements OnInit {
	pizza$: Observable<Pizza>;
	visualise$: Observable<Pizza>;
	toppings$: Observable<Topping[]>;

	constructor(private store: Store<fromStore.ProductsState>) {}

	ngOnInit() {
		this.store.dispatch(new fromStore.LoadToppings());
		this.pizza$ = this.store.select(fromStore.getSelectedPizza).pipe(
			tap((pizza: Pizza) => {
				const pizzaExist = !!(pizza && pizza.toppings);
				// FOR THE CHECK IF THE ROUTER IS FOR /products/2 /products/new
				// IN ONE CASE WE HAVE TOPPINGS, IN THE OTHER THE ARRAY IS EMPTY
				const toppings = pizzaExist ? pizza.toppings.map((topping) => topping.id) : [];

				this.store.dispatch(new fromStore.VisualizeToppings(toppings));
			})
		);
		this.toppings$ = this.store.select(fromStore.getAllToppings);
		this.visualise$ = this.store.select(fromStore.getPizzaVisualised);
	}

	onSelect(event: number[]) {
		this.store.dispatch(new fromStore.VisualizeToppings(event));
	}

	onCreate(event: Pizza) {
		this.store.dispatch(new fromStore.CreatePizza(event));
	}

	onUpdate(event: Pizza) {
		this.store.dispatch(new fromStore.UpdatePizza(event));
	}

	onRemove(event: Pizza) {
		const remove = window.confirm('Are you sure?');
		if (remove) {
			this.store.dispatch(new fromStore.RemovePizza(event));
		}
	}
}
