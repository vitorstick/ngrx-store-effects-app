import { createSelector } from '@ngrx/store';
import { Pizza } from 'src/products/models/pizza.model';
import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromPizzas from '../reducers/pizzas.reducer';

// pizzas state
export const getPizzaState = createSelector(
	fromFeature.getProductsState,
	(state: fromFeature.ProductsState) => state.pizzas
);

// MODIFIED FOR USING ENTITIES
export const getPizzasEntities = createSelector(getPizzaState, fromPizzas.getPizzasEntities);

export const getSelectedPizza = createSelector(
	getPizzasEntities,
	fromRoot.getRouterState,
	(entities, router): Pizza => {
		return router.state && entities[router.state.params.pizzaId];
	}
);

export const getAllPizzas = createSelector(getPizzasEntities, (entities) => {
	return Object.keys(entities).map((id) => entities[parseInt(id, 10)]);
});

export const getPizzasLoaded = createSelector(getPizzaState, fromPizzas.getPizzasLoaded);
export const getPizzasLoading = createSelector(getPizzaState, fromPizzas.getPizzasLoading);
