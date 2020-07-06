import { Action } from '@ngrx/store';
import { Pizza } from 'src/products/models/pizza.model';

// load pizzas
export const LOAD_PIZZAS = '[Products] Load Pizzas';
export const LOAD_PIZZAS_FAIL = '[Products] Load Pizzas Fail';
export const LOAD_PIZZAS_SUCCESS = '[Products] Load Pizzas Success';

export class LoadPizzas implements Action {
	readonly type = LOAD_PIZZAS;
}

export class LoadPizzasFail implements Action {
	readonly type = LOAD_PIZZAS_FAIL;
	constructor(public payload: any) {}
}

export class LoadPizzasSuccess implements Action {
	readonly type = LOAD_PIZZAS_SUCCESS;
	constructor(public payload: Pizza[]) {}
}

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
