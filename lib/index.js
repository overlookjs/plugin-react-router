/* --------------------
 * @overlook/plugin-react-router module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin');

// Imports
const pkg = require('../package.json');

// Exports

module.exports = new Plugin(
	pkg,
	{symbols: ['TEMP']},
	(Route, {TEMP}) => class ReactRouterRoute extends Route { // eslint-disable-line no-unused-vars
	}
);
