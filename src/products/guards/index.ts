import { PizzaExistsGuard } from './pizza-exist.guard';
import { PizzasGuard } from './pizzas.guard';
import { ToppingsGuard } from './toppings.guard';

export const guards: any[] = [ PizzasGuard, PizzaExistsGuard, ToppingsGuard ];

export * from './pizza-exist.guard';
export * from './pizzas.guard';
export * from './toppings.guard';
