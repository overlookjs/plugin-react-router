/* --------------------
 * @overlook/plugin-react-router module
 * Tests
 * Test function to ensure all exports present
 * ------------------*/

/* eslint-disable jest/no-export */

'use strict';

// Exports

module.exports = function itExports(reactRouterPlugin) {
	describe.skip('methods', () => { // eslint-disable-line jest/no-disabled-tests
		it.each([
			'TEMP'
		])('%s', (key) => {
			expect(reactRouterPlugin[key]).toBeFunction();
		});
	});

	describe('symbols', () => {
		it.each([
			'TEMP'
		])('%s', (key) => {
			expect(typeof reactRouterPlugin[key]).toBe('symbol');
		});
	});
};
