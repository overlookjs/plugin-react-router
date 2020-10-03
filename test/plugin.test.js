/* --------------------
 * @overlook/plugin-react-router module
 * Plugin tests
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	Route = require('@overlook/route'),
	fsPlugin = require('@overlook/plugin-fs'),
	reactPlugin = require('@overlook/plugin-react'),
	reactRouterPlugin = require('@overlook/plugin-react-router');

// Init
require('./support/index.js');

// Tests

describe('Plugin', () => {
	it('is an instance of Plugin class', () => {
		expect(reactRouterPlugin).toBeInstanceOf(Plugin);
	});

	it('when passed to `Route.extend()`, returns subclass of Route', () => {
		const ReactRouterRoute = Route.extend(reactRouterPlugin),
			FsRoute = Route.extend(fsPlugin),
			ReactRoute = FsRoute.extend(reactPlugin);
		expect(ReactRouterRoute).toBeFunction();
		expect(ReactRouterRoute).toBeSubclassOf(Route);
		expect(ReactRouterRoute).toBeSubclassOf(FsRoute);
		expect(ReactRouterRoute).toBeDirectSubclassOf(ReactRoute);
	});
});
