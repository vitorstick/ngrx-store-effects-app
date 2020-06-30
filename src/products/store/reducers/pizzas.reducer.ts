import { Pizza } from 'src/products/models/pizza.model';
import * as fromPizzas from '../actions/pizzas.action';

export interface PizzaState {
	entities: { [id: number]: Pizza };
	loaded: boolean;
	loading: boolean;
}

export const initialState: PizzaState = {
	entities: {},
	loaded: false,
	loading: false
};

export function reducer(state = initialState, action: fromPizzas.PizzaAction): PizzaState {
	switch (action.type) {
		case fromPizzas.LOAD_PIZZAS: {
			return {
				...state,
				loading: true
			};
		}
		case fromPizzas.LOAD_PIZZAS_SUCCESS: {
			// bind values to state data
			const pizzas = action.payload;

			const entities = pizzas.reduce(
				(entities: { [id: number]: Pizza }, pizza: Pizza) => {
					return {
						...entities,
						[pizza.id]: pizza
					};
				},
				{ ...state.entities }
			);
			return {
				...state,
				loading: false,
				loaded: true,
				entities
			};
		}
		case fromPizzas.LOAD_PIZZAS_FAIL: {
			return {
				...state,
				loading: false,
				loaded: false
			};
		}
	}
	return state;
}

export const getPizzasEntities = (state: PizzaState) => state.entities;
export const getPizzasLoading = (state: PizzaState) => state.loading;
export const getPizzasLoaded = (state: PizzaState) => state.loaded;
