/* --------------------
 * @overlook/plugin-react-router module
 * Tests
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	Route = require('@overlook/route'),
	reactRouterPlugin = require('@overlook/plugin-react-router');

// Init
require('./support/index.js');

// Tests

describe('Plugin', () => {
	it('is an instance of Plugin class', () => {
		expect(reactRouterPlugin).toBeInstanceOf(Plugin);
	});

	it('when passed to `Route.extend()`, returns subclass of Route', () => {
		const ReactRouterRoute = Route.extend(reactRouterPlugin);
		expect(ReactRouterRoute).toBeFunction();
		expect(ReactRouterRoute).toBeDirectSubclassOf(Route);
	});
});
