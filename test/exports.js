/* --------------------
 * @overlook/plugin-react-router module
 * Tests
 * Test function to ensure all exports present
 * ------------------*/

/* eslint-disable jest/no-export */

'use strict';

// Exports

module.exports = function itExports(reactRouterPlugin) {
	describe('symbols', () => {
		it.each([
			'REACT_ROUTER_FILE',
			'GET_REACT_ROUTER_FILE',
			'REACT_ROUTER_ROOT_FILE',
			'GET_REACT_ROUTER_ROOT_FILE',
			'ROUTER_ROUTES',
			'CREATE_REACT_ROUTER_FILE',
			'CREATE_REACT_ROUTER_ROOT_FILE',
			'ROUTER_IS_LAZY',
			'GET_ROUTER_IS_LAZY'
		])('%s', (key) => {
			expect(typeof reactRouterPlugin[key]).toBe('symbol');
		});
	});
};
