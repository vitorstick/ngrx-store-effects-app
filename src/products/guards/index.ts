import { PizzaExistsGuard } from './pizza-exist.guard';
import { PizzasGuard } from './pizzas.guard';

export const guards: any[] = [ PizzasGuard, PizzaExistsGuard ];

export * from './pizza-exist.guard';
export * from './pizzas.guard';
