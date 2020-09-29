/* --------------------
 * @overlook/plugin-react-router module
 * Tests
 * ESM export
 * ------------------*/

// Modules
import Plugin from '@overlook/plugin';
import reactRouterPlugin, * as namedExports from '@overlook/plugin-react-router/es';

// Imports
import itExports from './exports.js';

// Tests

describe('ESM export', () => {
	it('default export is an instance of Plugin class', () => {
		expect(reactRouterPlugin).toBeInstanceOf(Plugin);
	});

	describe('default export has properties', () => {
		itExports(reactRouterPlugin);
	});

	describe('named exports', () => {
		itExports(namedExports);
	});
});
