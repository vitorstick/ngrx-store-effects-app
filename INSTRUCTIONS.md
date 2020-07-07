# NGRX

## 1st
## Create Actions
products/store/actions/pizzas.actions.ts

```

  import {Action} from '@ngrx/store';

  export const LOAD_PIZZAS_SUCCESS = '[Products] Load Pizzas Success';

  export class LoadPizzasSuccess implements Action {
    readonly type = LOAD_PIZZAS_SUCCESS;
    constructor(public payload: Pizza[]) {}
  }

  export type PizzaAction = ... | LoadPizzasSuccess;

```

## 2nd
## Create Reducers
1. products/store/reducers/pizzas.reducers.ts

```

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
```

### export
2. products/store/reducers/index.ts

```

  import { ActionReducerMap } from '@ngrx/store';
  import * as fromPizzas from './pizzas.reducer';

  export interface ProductsState {
    pizzas: fromPizzas.PizzaState;
  }

  export const reducers: ActionReducerMap<ProductsState> = {
    pizzas: fromPizzas.reducer
  };

  ```

3. products/store/index.ts

```
  export * from './reducers';

products.module.ts

  // reducers
  import { reducers } from './store';
  @NgModule({
    imports: [
      ...
      StoreModule.forFeature('products', reducers)
    ],
    ...

```

## 3rd 
## State composition 
products/store/reducers/pizzas.reducers.ts

```
...

  export const getPizzasLoading = (state: PizzaState) => state.loading;
  export const getPizzasLoaded = (state: PizzaState) => state.loaded;
  export const getPizzas = (state: PizzaState) => state.data;

  products/store/reducers/index.ts
  import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
  export const getProductsState = createFeatureSelector<ProductsState>('products');

  // pizzas state
  export const getPizzaState = createSelector(getProductsState, (state: ProductsState) => state.pizzas);

  export const getAllPizzas = createSelector(getPizzaState, fromPizzas.getPizzas);
  export const getAllPizzasLoaded = createSelector(getPizzaState, fromPizzas.getPizzasLoaded);
  export const getAllPizzasLoading = createSelector(getPizzaState, fromPizzas.getPizzasLoading);

```

### products component
#### On Ts
```
  import { Store } from '@ngrx/store';
  import * as fromStore from '../../store';

  pizzas$: Observable<Pizza[]>;

  constructor(private store: Store<fromStore.ProductsState>) {}

  ngOnInit() {
    this.pizzas$ = this.store.select(fromStore.getAllPizzas);
  }
```

#### On HTML

```
  *ngFor="let pizza of (pizzas$ | async)"
```

## 4th
## Our first @Effect

1. products/store/efects/pizzas.effect.ts

```

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

```

2. products/store/efects/index.ts

```

  import { PizzasEffects } from './pizzas.effect';
  export const effects: any[] = [ PizzasEffects ];
  export * from './pizzas.effect';

  ```

3. products.component.ts

```

  ngOnInit() {
    this.pizzas$ = this.store.select(fromStore.getAllPizzas);
    this.store.dispatch(new fromStore.LoadPizzas());
  }

```

4. products.module.ts

```

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

```

5. products/store/reducers/pizzas.reducers.ts

```
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

```


## 5th
## Entities
### Change data structure to use entities to optimize and not use arrays
1. products/store/reducers/pizzas.reducers.ts

```
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

...

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

...

  export const getPizzasEntities = (state: PizzaState) => state.entities;
  export const getPizzasLoading = (state: PizzaState) => state.loading;
  export const getPizzasLoaded = (state: PizzaState) => state.loaded;

```

2. products/store/reducers/index.ts
  // MODIFIED FOR USING ENTITIES

```

  export const getPizzasEntities = createSelector(getPizzaState, fromPizzas.getPizzasEntities);

  export const getAllPizzas = createSelector(getPizzasEntities, (entities) => {
    return Object.keys(entities).map((id) => entities[parseInt(id, 10)]);
  });

  export const getPizzasLoaded = createSelector(getPizzaState, fromPizzas.getPizzasLoaded);

  export const getPizzasLoading = createSelector(getPizzaState, fromPizzas.getPizzasLoading);

```


## 6th
## Hooking up @ngrx/router-store
1. app/store/reducers/index.ts

```

...
import { Params } from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

export interface RouterStateUrl {
	url: string;
	queryParams: Params;
	params: Params;
}

export interface State {
	routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
	routerReducer: fromRouter.routerReducer
};

// CREATE SELECTORS
export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('routerReducer');
...

```

2. app/store/index.ts
```
export * from './reducers';
```


3. app/app.module.ts

```

import { reducers } from './store';

	imports: [
    ...
		StoreModule.forRoot(reducers, { metaReducers }),
    ...
	],
```

## 7th
## Custom Router State Serializers
* app/store/reducers/index.ts

```

import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';

...
export class CustomSerializer implements fromRouter.RouterStateSerializer<RouterStateUrl> {
	serialize(routerState: RouterStateSnapshot): RouterStateUrl {
		const { url } = routerState;
		const { queryParams } = routerState.root;

		let state: ActivatedRouteSnapshot = routerState.root;
		// iterate through state tree of angular router
		while (state.firstChild) {
			state = state.firstChild;
		}
		const { params } = state;

		return { url, queryParams, params };
	}
}
```

* app/app.module.ts

```
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer, reducers } from './store';

...

@NgModule({
	imports: [
    ....
		StoreRouterConnectingModule,
    ....
	],
	providers: [ { provide: RouterStateSerializer, useClass: CustomSerializer } ],
  ....
})
```

## 8th
## Router State and Entity Composition
### Turn things more scalable!
1. Create the selectors/pizzas.selectors.ts

2. Move from reducers/index.ts to selectors/pizzas.selectors.ts the following code

```
// pizzas state
export const getPizzaState = createSelector(getProductsState, (state: ProductsState) => state.pizzas);

// MODIFIED FOR USING ENTITIES
export const getPizzasEntities = createSelector(getPizzaState, fromPizzas.getPizzasEntities);

export const getAllPizzas = createSelector(getPizzasEntities, (entities) => {
	return Object.keys(entities).map((id) => entities[parseInt(id, 10)]);
});

export const getPizzasLoaded = createSelector(getPizzaState, fromPizzas.getPizzasLoaded);
export const getPizzasLoading = createSelector(getPizzaState, fromPizzas.getPizzasLoading);
```

3. Add getSelectedPizza
```
...

export const getSelectedPizza = createSelector(
	getPizzasEntities,
	fromRoot.getRouterState,
	(entities, router): Pizza => {
		return router.state && entities[router.state.params.pizzaId];
	}
);

...
```


4. Change products\containers\product-item\product-item.component.ts
```
      ...
      <pizza-form
        [pizza]="pizza$ | async"
      ...


import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

...

export class ProductItemComponent implements OnInit {
	pizza$: Observable<Pizza>;
	visualise: Pizza;
	toppings: Topping[];

	constructor(private store: Store<fromStore.ProductsState>) {}

	ngOnInit() {
		this.pizza$ = this.store.select(fromStore.getSelectedPizza);
	}

	onSelect(event: number[]) {}

	onCreate(event: Pizza) {}

	onUpdate(event: Pizza) {}

	onRemove(event: Pizza) {
		const remove = window.confirm('Are you sure?');
		if (remove) {
		}
	}
}
```

## 9th
## Further Action Creators
### Actions for getting the toppings
1. Create the store/actions/toppings.actions.ts and create the content, similar to pizzas.actions.ts

```
import { Action } from '@ngrx/store';
import { Topping } from 'src/products/models/topping.model';

// load toppings
export const LOAD_TOPPINGS = '[Products] Load Toppings';
export const LOAD_TOPPINGS_FAIL = '[Products] Load Toppings Fail';
export const LOAD_TOPPINGS_SUCCESS = '[Products] Load Toppings Success';

export class LoadToppings implements Action {
	readonly type = LOAD_TOPPINGS;
}

export class LoadToppingsFail implements Action {
	readonly type = LOAD_TOPPINGS_FAIL;
	constructor(public payload: any) {}
}

export class LoadToppingsSuccess implements Action {
	readonly type = LOAD_TOPPINGS_SUCCESS;
	constructor(public payload: Topping[]) {}
}

export type ToppingsAction = LoadToppings | LoadToppingsFail | LoadToppingsSuccess;
```

2. On products\containers\product-item\product-item.component.ts
dispatch the action for getting the toppings

```
...
	ngOnInit() {
    this.store.dispatch(new fromStore.LoadToppings());
    ...
	}
  ...
```

## 10th
## Multiple Reducers
### Reducer for getting the toppings
1. Create the store/reducers/toppings.reducer.ts and create the content, similar to pizzas.reducer.ts

```
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
```

2. register the reducer on store/reducers/index.ts

```
...

export interface ProductsState {
	pizzas: fromPizzas.PizzaState;
	toppings: fromToppings.ToppingsState;
}

export const reducers: ActionReducerMap<ProductsState> = {
	pizzas: fromPizzas.reducer,
	toppings: fromToppings.reducer
};
...
```

## 11th
## Further Effects
### Effects for the toppings

1. Create the store/effects/toppings.effect.ts and create the content, similar to pizzas.effect.ts

```
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/Observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromServices from '../../services';
import * as toppingActions from '../actions/toppings.actions';

@Injectable()
export class ToppingEffects {
	constructor(private actions$: Actions, private toppingService: fromServices.ToppingsService) {}

	// EFFECTS RETURN ACTIONS
	@Effect()
	loadToppings$ = this.actions$.ofType(toppingActions.LOAD_TOPPINGS).pipe(
		switchMap(() => {
			return this.toppingService
				.getToppings()
				.pipe(
					map((toppings) => new toppingActions.LoadToppingsSuccess(toppings)),
					catchError((error) => of(new toppingActions.LoadToppingsFail(error)))
				);
		})
	);
}
```

2. Register the effect on effects\index.ts

```
import { PizzasEffects } from './pizzas.effect';
import { ToppingEffects } from './toppings.effect';

export const effects: any[] = [ PizzasEffects, ToppingEffects ];

export * from './pizzas.effect';
export * from './toppings.effect';
```

## 12th
## Selector Composition
### Selectors for the toppings

1. Create the store/selectors/toppings.selectors.ts and create the content, similar to pizzas.selectors.ts

```
import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromToppings from '../reducers/toppings.reducer';

// toppings state
export const getToppingsState = createSelector(
	fromFeature.getProductsState,
	(state: fromFeature.ProductsState) => state.toppings
);

// FOR USING ENTITIES
export const getToppingsEntities = createSelector(getToppingsState, fromToppings.getToppingEntities);

export const getAllToppings = createSelector(getToppingsEntities, (entities) => {
	return Object.keys(entities).map((id) => entities[parseInt(id, 10)]);
});

export const getToppingsLoaded = createSelector(getToppingsState, fromToppings.getToppingLoaded);
export const getToppingsLoading = createSelector(getToppingsState, fromToppings.getToppingLoading);

```

2. Bond the action to the product-item.component.ts

```
      ...
      <pizza-form
        [pizza]="pizza$ | async"
        [toppings]="toppings$ | async"
        ...

```
  ...

```
  ...
	toppings$: Observable<Topping[]>;

	constructor(private store: Store<fromStore.ProductsState>) {}

	ngOnInit() {
		this.store.dispatch(new fromStore.LoadToppings());
		this.pizza$ = this.store.select(fromStore.getSelectedPizza);
		this.toppings$ = this.store.select(fromStore.getAllToppings);
	}
  ...
```


## 13th
## Mapping IDs to Entities
### Visualize the pizza with toppings

1. Create the actions => toppings.actions.ts

```
...
export const VISUALIZE_TOPPINGS = '[Products] Visualize Toppings';

...

export class VisualizeToppings implements Action {
	readonly type = VISUALIZE_TOPPINGS;
	constructor(public payload: number[]) {}
}

export type ToppingsAction = LoadToppings | LoadToppingsFail | LoadToppingsSuccess | VisualizeToppings;

```
2. Create the reducer => toppings.reducer.ts

```
...

export interface ToppingsState {
	entities: { [id: number]: Topping };
	loaded: boolean;
	loading: boolean;
	selectedToppings: number[];
}

export const initialState: ToppingsState = {
	entities: {},
	loaded: false,
	loading: false,
	selectedToppings: []
};

export function reducer(state = initialState, action: fromToppings.ToppingsAction): ToppingsState {
	switch (action.type) {
		case fromToppings.VISUALIZE_TOPPINGS: {
			const selectedToppings = action.payload;
			return {
				...state,
				selectedToppings
			};
		}

    ...

export const getSelectedToppings = (state: ToppingsState) => state.selectedToppings;

```

3. Create the selector for toppings => toppings.selectors.ts

```
export const getSelectedToppings = createSelector(getToppingsState, fromToppings.getSelectedToppings);

```

4. Create the selector for toppings on pizza select => pizzas.selectors.ts

```
import * as fromToppings from './toppings.selectors';

...

export const getPizzaVisualised = createSelector(
	getSelectedPizza,
	fromToppings.getToppingsEntities,
	fromToppings.getSelectedToppings,
	(pizza, toppingEntities, selectedToppings) => {
		const toppings = selectedToppings.map((id) => toppingEntities[id]);
		return {
			...pizza,
			toppings
		};
	}
);

```


## 14th
## Store Selectors and Async Pipe
1. Load toppings on products.component.ts

```
	ngOnInit() {
    ...
		this.store.dispatch(new fromStore.LoadToppings());
	}
```

2. Load toppings on product-item.component.ts
```
        <pizza-display
          [pizza]="visualise$ | async">
        </pizza-display>
        ...
```

```
  ...
	visualise$: Observable<Pizza>;

  ...

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

  ...

  onSelect(event: number[]) {
		this.store.dispatch(new fromStore.VisualizeToppings(event));
	}
  
```

## 15th
## Creating, via Dispatch, Reducer and Effect
### CRUD Operations

1. Create actions on pizzas.actions.ts

```
...

// CREATE PIZZA
export const CREATE_PIZZA = '[Products] Create Pizza';
export const CREATE_PIZZA_FAIL = '[Products] Create Pizza Fail';
export const CREATE_PIZZA_SUCESS = '[Products] Create Pizza Sucess';

export class CreatePizza implements Action {
	readonly type = CREATE_PIZZA;
	constructor(public payload: Pizza) {}
}

export class CreatePizzaFail implements Action {
	readonly type = CREATE_PIZZA_FAIL;
	constructor(public payload: any) {}
}

export class CreatePizzaSuccess implements Action {
	readonly type = CREATE_PIZZA_SUCESS;
	constructor(public payload: Pizza) {}
}

export type PizzaAction =
	| LoadPizzas
	| LoadPizzasFail
	| LoadPizzasSuccess
	| CreatePizza
	| CreatePizzaFail
	| CreatePizzaSuccess;
```

2. Dispatch action for new pizza on product-item.component.ts

```
  ...
	onCreate(event: Pizza) {
		this.store.dispatch(new fromStore.CreatePizza(event));
	}
  ...
```

3. Create the effects on pizza.effect.ts

```
  ...
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
  ...

```

4. Bind to the state on pizzas.reducer.ts

```
  ...
    case fromPizzas.CREATE_PIZZA_SUCESS: {
			const pizza = action.payload;

			const entities = {
				...state.entities,
				[pizza.id]: pizza
			};
			return {
				...state,
				entities
			};
		}
		case fromPizzas.CREATE_PIZZA_FAIL: {
			return {
				...state
			};
		}
  ...
  
```

## 16th
## Updating, via Dispatch, Reducer and Effect
### CRUD Operations

1. Create the actions on pizzas.actions.ts

```
...
// UPDATE PIZZA
export const UPDATE_PIZZA = '[Products] Update Pizza';
export const UPDATE_PIZZA_FAIL = '[Products] Update Pizza Fail';
export const UPDATE_PIZZA_SUCCESS = '[Products] Update Pizza Success';

export class UpdatePizza implements Action {
	readonly type = UPDATE_PIZZA;
	constructor(public payload: Pizza) {}
}

export class UpdatePizzaFail implements Action {
	readonly type = UPDATE_PIZZA_FAIL;
	constructor(public payload: any) {}
}

export class UpdatePizzaSuccess implements Action {
	readonly type = UPDATE_PIZZA_SUCCESS;
	constructor(public payload: Pizza) {}
}
...
export type PizzaAction =
  ...
	| UpdatePizza
	| UpdatePizzaFail
	| UpdatePizzaSuccess;

```

2. Dispatch the actions on product-item.component.ts
```
	onUpdate(event: Pizza) {
		this.store.dispatch(new fromStore.UpdatePizza(event));
	}
```
3. Create the Effect for actions on pizzas.effect.ts
```
...
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
  ...
```
4. Bind the action on pizzas.reducer.ts (JUST ADD THE CASE, THE CODE WILL BE SIMILAR FOR CREATE AND UPDATE)

```
    // CRUD OPERATIONS FOR PIZZA
    // FOR CREATE AND UPDATE IS SIMILIAR
		case fromPizzas.CREATE_PIZZA_SUCESS:
		case fromPizzas.UPDATE_PIZZA_SUCCESS: {
			const pizza = action.payload;

			const entities = {
				...state.entities,
				[pizza.id]: pizza
			};
			return {
				...state,
				entities
			};
		}
		case fromPizzas.CREATE_PIZZA_FAIL: {
			return {
				...state
			};
		}
	}

```

## 17th
## Deleting, via Dispatch, Reducer and Effect
### CRUD Operations for Delete

1. Create the actions on pizzas.actions.ts

```
...
// REMOVE PIZZA
export const REMOVE_PIZZA = '[Products] Remove Pizza';
export const REMOVE_PIZZA_FAIL = '[Products] Remove Pizza Fail';
export const REMOVE_PIZZA_SUCCESS = '[Products] Remove Pizza Success';

export class RemovePizza implements Action {
	readonly type = REMOVE_PIZZA;
	constructor(public payload: Pizza) {}
}

export class RemovePizzaFail implements Action {
	readonly type = REMOVE_PIZZA_FAIL;
	constructor(public payload: any) {}
}

export class RemovePizzaSuccess implements Action {
	readonly type = REMOVE_PIZZA_SUCCESS;
	constructor(public payload: Pizza) {}
}
...
export type PizzaAction =
  ...
	| RemovePizza
	| RemovePizzaFail
	| RemovePizzaSuccess;

```

2. Dispatch the actions on product-item.component.ts
```
	onRemove(event: Pizza) {
		const remove = window.confirm('Are you sure?');
		if (remove) {
			this.store.dispatch(new fromStore.RemovePizza(event));
		}
	}

```
3. Create the Effect for actions on pizzas.effect.ts
```
...
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
  ...
```
4. Bind the action on pizzas.reducer.ts (JUST ADD THE CASE, THE CODE WILL BE SIMILAR FOR CREATE AND UPDATE)

```
		case fromPizzas.REMOVE_PIZZA_SUCCESS: {
			const pizza = action.payload;
			const { [pizza.id]: removed, ...entities } = state.entities;
			return {
				...state,
				entities
			};
		}

```

## 18th
## Router Actions and Effect
### Routing effects and actions for navigation

1. Create the actions file app/store/actions/router.action.ts and app/store/actions/index.ts

```
import { NavigationExtras } from '@angular/router';
import { Action } from '@ngrx/store';

export const GO = '[Router] GO';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';

export class Go implements Action {
	readonly type = GO;

	constructor(
		public payload: {
			path: any[];
			query?: Object;
			extras?: NavigationExtras;
		}
	) {}
}

export class Back implements Action {
	readonly type = BACK;
}

export class Forward implements Action {
	readonly type = FORWARD;
}

export type Actions = Go | Back | Forward;

```

2. Export on index.ts
```
export * from './router.action';

```

3. Create the actions file app/store/effects/router.effect.ts
```
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as RouterActions from '../actions/router.action';

@Injectable()
export class RouterEffects {
	constructor(private actions$: Actions, private router: Router, private location: Location) {}

	@Effect({ dispatch: false })
	navigate$ = this.actions$.ofType(RouterActions.GO).pipe(
		map((action: RouterActions.Go) => action.payload),
		tap(({ path, query: queryParams, extras }) => {
			this.router.navigate(path, { queryParams, ...extras });
		})
	);

	@Effect({ dispatch: false })
	navigateBack$ = this.actions$.ofType(RouterActions.BACK).pipe(
		tap(() => {
			this.location.back();
		})
	);

	@Effect({ dispatch: false })
	navigateForward$ = this.actions$.ofType(RouterActions.FORWARD).pipe(
		tap(() => {
			this.location.forward();
		})
	);
}
```

4. Import and export app/store/effects/index.ts

```
import { RouterEffects } from './router.effect';

export const effects: any[] = [ RouterEffects ];
export * from './router.effect';

```

5. Export effects and actions on app/store/index.ts

```
export * from './actions';
export * from './effects';
export * from './reducers';

```

6. Bind effects array on app.module.ts

```
...

import { CustomSerializer, effects, reducers } from './store';

...
@NgModule({
	imports: [
    ...
		EffectsModule.forRoot(effects),
    ...
	],
  ...
})

...

```

## 19th
## Multiple Actions in Effects, Router Actions
### Effects calling other Effects based on Actions and routing

1. New Effects on pizzas.effect.ts for managing routing on action
```
...

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

...


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

  ...
  
```

## 20th
## Preloading across multiple Routes
### Creating guards for the routes and dispatch action from there

1. Create folder and files products/guards/pizzas.guard.ts and products/guards/index.ts

```
// products/guards/pizzas.guard.ts
import { Observable } from 'rxjs/Observable';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import * as fromStore from '../store';

@Injectable()
export class PizzasGuard implements CanActivate {
	constructor(private store: Store<fromStore.ProductsState>) {}

	canActivate(): Observable<boolean> {
		return this.checkStore().pipe(switchMap(() => of(true)), catchError(() => of(false)));
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
```

```
// products/guards/pizzas.guard.ts
import { PizzasGuard } from './pizzas.guard';

export const guards: any[] = [ PizzasGuard ];

export * from './pizzas.guard';
```

2. Register it on products.module.ts and bind it on the routes with canActivate

```
...
// guards
import * as fromGuards from './guards';
...

// routes
export const ROUTES: Routes = [
	{
		path: '',
		canActivate: [ fromGuards.PizzasGuard ],
		component: fromContainers.ProductsComponent
	},
	{
		path: 'new',
		canActivate: [ fromGuards.PizzasGuard ],
		component: fromContainers.ProductItemComponent
	},
  ...
];

...

@NgModule({
  ...
	providers: [ ...fromServices.services, ...fromGuards.guards ],
  ...
})
```

3. Remove the dispatch of the action from products.component.ts

```
	ngOnInit() {
		this.pizzas$ = this.store.select(fromStore.getAllPizzas);
		// replacing this dispatch for route guard dispatch
		// this.store.dispatch(new fromStore.LoadPizzas());
		this.store.dispatch(new fromStore.LoadToppings());
	}
```

## 21th
## Guards that check Store Entities
### Creating guards for validating the routes

1. Create folder and files products/guards/pizza-exist.guard.ts and products/guards/index.ts

```
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

```
2. Import pizza-exist.guard.ts on index.ts

```
import { PizzaExistsGuard } from './pizza-exist.guard';
import { PizzasGuard } from './pizzas.guard';

export const guards: any[] = [ PizzasGuard, PizzaExistsGuard ];

export * from './pizza-exist.guard';
export * from './pizzas.guard';

```
3. Set guard on can activate on routes of products.module

```
...
export const ROUTES: Routes = [
  ...
	{
		path: ':pizzaId',
		canActivate: [ fromGuards.PizzaExistsGuard ],
		component: fromContainers.ProductItemComponent
	}
  ...
];
...

```
