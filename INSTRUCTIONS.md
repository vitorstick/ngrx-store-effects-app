# NGRX

## 1st
## Create Actions
store/actions/pizzas.actions.ts
import {Action} from '@ngrx/store';

export const LOAD_PIZZAS_SUCCESS = '[Products] Load Pizzas Success';

export class LoadPizzasSuccess implements Action {
	readonly type = LOAD_PIZZAS_SUCCESS;
	constructor(public payload: Pizza[]) {}
}

export type PizzaAction = ... | LoadPizzasSuccess;

## 2nd
## Create Reducers
store/reducers/pizzas.reducers.ts
import * as fromPizzas from '../actions/pizzas.action';

export const initialState: PizzaState = {
	data: [],
	loaded: false,
	loading: false
};
export const initialState: PizzaState = {
	data: [],
	loaded: false,
	loading: false
};

export function reducer(state = initialState, action: fromPizzas.PizzaAction): PizzaState {
	switch (action.type) {
    case ...
    
		case fromPizzas.LOAD_PIZZAS_SUCCESS: {
			return {
				...state,
				loading: false,
				loaded: true
			};
    }
	}
	return state;
}

### export
store/reducers/index.ts
import { ActionReducerMap } from '@ngrx/store';
import * as fromPizzas from './pizzas.reducer';

export interface ProductsState {
	pizzas: fromPizzas.PizzaState;
}

export const reducers: ActionReducerMap<ProductsState> = {
	pizzas: fromPizzas.reducer
};

store/index.ts
export * from './reducers';

products.module.ts
// reducers
import { reducers } from './store';
@NgModule({
	imports: [
    ...
		StoreModule.forFeature('products', reducers)
	],
