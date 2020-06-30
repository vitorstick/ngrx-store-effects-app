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
...
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
#### On Ts
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

pizzas$: Observable<Pizza[]>;

constructor(private store: Store<fromStore.ProductsState>) {}

ngOnInit() {
  this.pizzas$ = this.store.select(fromStore.getAllPizzas);
}

#### On HTML
*ngFor="let pizza of (pizzas$ | async)"


## 4th
## Our first @Effect
store/efects/pizzas.effect.ts
import { Actions, Effect } from '@ngrx/effects';
import * as fromServices from '../../services';
import * as pizzaActions from '../actions/pizzas.action';

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
}

store/efects/index.ts
import { PizzasEffects } from './pizzas.effect';
export const effects: any[] = [ PizzasEffects ];
export * from './pizzas.effect';

products.component.ts
ngOnInit() {
  this.pizzas$ = this.store.select(fromStore.getAllPizzas);
  this.store.dispatch(new fromStore.LoadPizzas());
}

products.module.ts
// reducers / effects
import { effects, reducers } from './store';
@NgModule({
	imports: [
    ...
		StoreModule.forFeature('products', reducers),
		EffectsModule.forFeature(effects)
	],
  ...
})
export class ProductsModule {}

store/reducers/pizzas.reducers.ts
...
case fromPizzas.LOAD_PIZZAS_SUCCESS: {
  // bind values to state data
  // console.log('action.payload', action.payload);
  const data = action.payload;
  return {
    ...state,
    loading: false,
    loaded: true,
    data
  };
}
...
