import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
// components
import * as fromComponents from './components';
// containers
import * as fromContainers from './containers';
// guards
import * as fromGuards from './guards';
// services
import * as fromServices from './services';
// reducers / effects
import { effects, reducers } from './store';

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
	{
		path: ':pizzaId',
		canActivate: [ fromGuards.PizzaExistsGuard ],
		component: fromContainers.ProductItemComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		HttpClientModule,
		RouterModule.forChild(ROUTES),
		StoreModule.forFeature('products', reducers),
		EffectsModule.forFeature(effects)
	],
	providers: [ ...fromServices.services, ...fromGuards.guards ],
	declarations: [ ...fromContainers.containers, ...fromComponents.components ],
	exports: [ ...fromContainers.containers, ...fromComponents.components ]
})
export class ProductsModule {}
