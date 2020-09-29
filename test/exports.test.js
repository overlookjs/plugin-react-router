/* --------------------
 * @overlook/plugin-react-router module
 * Tests
 * CJS export
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	reactRouterPlugin = require('@overlook/plugin-react-router');

// Imports
const itExports = require('./exports.js');

// Tests

describe('CJS export', () => {
	it('is an instance of Plugin class', () => {
		expect(reactRouterPlugin).toBeInstanceOf(Plugin);
	});

	describe('has properties', () => {
		itExports(reactRouterPlugin);
	});
});
