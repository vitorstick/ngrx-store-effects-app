import * as fromToppings from './toppings.actions';

describe('Toppings Actions', () => {
	describe('LoadToppings Actions', () => {
		describe('LoadToppings', () => {
			it('should create an action', () => {
				const action = new fromToppings.LoadToppings();

				expect({ ...action }).toEqual({
					type: fromToppings.LOAD_TOPPINGS
				});
			});
		});
		describe('LoadToppingsFail', () => {
			it('should create an action', () => {
				const payload = { message: 'Load Error' };
				const action = new fromToppings.LoadToppingsFail(payload);

				expect({ ...action }).toEqual({
					type: fromToppings.LOAD_TOPPINGS_FAIL,
					payload
				});
			});
		});
		describe('LoadToppingsSuccess', () => {
			it('should create an action', () => {
				const payload = [
					{
						id: 1,
						name: 'anchovy'
					},
					{
						id: 2,
						name: 'bacon'
					},
					{
						id: 3,
						name: 'basil'
					},
					{
						id: 4,
						name: 'chili'
					},
					{
						id: 5,
						name: 'mozzarella'
					},
					{
						id: 6,
						name: 'mushroom'
					},
					{
						id: 7,
						name: 'olive'
					},
					{
						id: 8,
						name: 'onion'
					},
					{
						id: 9,
						name: 'pepper'
					},
					{
						id: 10,
						name: 'pepperoni'
					},
					{
						id: 11,
						name: 'sweetcorn'
					},
					{
						id: 12,
						name: 'tomato'
					}
				];
				const action = new fromToppings.LoadToppingsSuccess(payload);

				expect({ ...action }).toEqual({
					type: fromToppings.LOAD_TOPPINGS_SUCCESS,
					payload
				});
			});
		});
	});

	describe('VisualizeToppings Actions', () => {
		describe('LoadToppings', () => {
			it('should create an action', () => {
				const payload = [ 1, 2, 3 ];
				const action = new fromToppings.VisualizeToppings(payload);

				expect({ ...action }).toEqual({
					type: fromToppings.VISUALIZE_TOPPINGS,
					payload
				});
			});
		});
	});
});
