import { Pizza } from 'src/products/models/pizza.model';
import * as fromPizzas from '../actions/pizzas.action';

export interface PizzaState {
	data: Pizza[];
	loaded: boolean;
	loading: boolean;
}

export const initialState: PizzaState = {
	data: [],
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
			return {
				...state,
				loading: false,
				loaded: true
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
