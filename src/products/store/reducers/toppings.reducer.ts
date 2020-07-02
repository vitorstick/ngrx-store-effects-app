import { Topping } from 'src/products/models/topping.model';
import * as fromToppings from '../actions/toppings.actions';

export interface ToppingsState {
	entities: { [id: number]: Topping };
	loaded: boolean;
	loading: boolean;
}

export const initialState: ToppingsState = {
	entities: {},
	loaded: false,
	loading: false
};

export function reducer(state = initialState, action: fromToppings.ToppingsAction): ToppingsState {
	switch (action.type) {
		case fromToppings.LOAD_TOPPINGS: {
			return {
				...state,
				loading: true
			};
		}

		case fromToppings.LOAD_TOPPINGS_SUCCESS: {
			// bind values to state data
			const toppings = action.payload;

			const entities = toppings.reduce(
				(entities: { [id: number]: Topping }, topping: Topping) => {
					return {
						...entities,
						[topping.id]: topping
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

		case fromToppings.LOAD_TOPPINGS_FAIL: {
			return {
				...state,
				loading: false,
				loaded: false
			};
		}
	}
	return state;
}

export const getToppingEntities = (state: ToppingsState) => state.entities;
export const getToppingLoading = (state: ToppingsState) => state.loading;
export const getToppingLoaded = (state: ToppingsState) => state.loaded;
