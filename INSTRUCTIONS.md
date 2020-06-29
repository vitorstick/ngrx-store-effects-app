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


## 3rd 
## State composition 
store/reducers/pizzas.reducers.ts
export const getPizzasLoading = (state: PizzaState) => state.loading;
export const getPizzasLoaded = (state: PizzaState) => state.loaded;
export const getPizzas = (state: PizzaState) => state.data;

store/reducers/index.ts
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
export const getProductsState = createFeatureSelector<ProductsState>('products');

// pizzas state
export const getPizzaState = createSelector(getProductsState, (state: ProductsState) => state.pizzas);

export const getAllPizzas = createSelector(getPizzaState, fromPizzas.getPizzas);
export const getAllPizzasLoaded = createSelector(getPizzaState, fromPizzas.getPizzasLoaded);
export const getAllPizzasLoading = createSelector(getPizzaState, fromPizzas.getPizzasLoading);

### products component
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

pizzas$: Observable<Pizza[]>;

	constructor(private store: Store<fromStore.ProductsState>) {}

	ngOnInit() {
		this.pizzas$ = this.store.select(fromStore.getAllPizzas);
	}


  *ngFor="let pizza of (pizzas$ | async)"
