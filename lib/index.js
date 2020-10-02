/* --------------------
 * @overlook/plugin-react-router module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	{INIT_PROPS, INIT_ROUTE, INIT_CHILDREN} = require('@overlook/route'),
	fsPlugin = require('@overlook/plugin-fs'),
	reactPlugin = require('@overlook/plugin-react'),
	{GET_REACT_ROOT_FILE} = require('@overlook/plugin-react-root'),
	{FILES} = require('@overlook/plugin-load'),
	{URL_PATH} = require('@overlook/plugin-path'),
	{PRE_BUILD, deleteRouteProperties} = require('@overlook/plugin-build'),
	{findParent} = require('@overlook/util-find-parent');

// Imports
const pkg = require('../package.json'),
	createRouter = require('./createRouter.js');

// Exports

module.exports = new Plugin(
	pkg,
	[fsPlugin, reactPlugin],
	{
		symbols: [
			'REACT_ROUTER_FILE', 'GET_REACT_ROUTER_FILE', 'ROUTER_ROUTES', 'CREATE_ROUTER_FILE'
		]
	},
	(Route, {
		REACT_ROUTER_FILE, GET_REACT_ROUTER_FILE, ROUTER_ROUTES, CREATE_ROUTER_FILE,
		REACT_FILE, REACT_ROOT, REACT_ROUTER, ROUTER_ADD_ROUTE, WRITE_FILE
	}) => class ReactRouterRoute extends Route {
		[INIT_PROPS](props) {
			super[INIT_PROPS](props);
			this[REACT_ROUTER_FILE] = undefined;
			this[ROUTER_ROUTES] = undefined;
		}

		async [INIT_ROUTE]() {
			// Define `[REACT_ROUTER]` before calling superclass, so it's defined
			// before `plugin-react`'s `[INIT_ROUTE]()` method executes.
			this[REACT_ROUTER] = this;

			// Delegate to super classes
			await super[INIT_ROUTE]();

			this[ROUTER_ROUTES] = [];

			// Get / create router file
			let routerFile = this[REACT_ROUTER_FILE];
			if (!routerFile) {
				routerFile = [GET_REACT_ROUTER_FILE]();
				if (!routerFile) {
					// Create empty router file
					routerFile = await this[WRITE_FILE]('router.jsx', '');
				}

				this[REACT_ROUTER_FILE] = routerFile;
			}

			// If this is not react root, pass router file down to parent router
			if (this[REACT_ROOT] !== this) {
				let parentRouter;
				findParent(route => parentRouter = route[REACT_ROUTER]); // eslint-disable-line no-return-assign
				if (parentRouter) parentRouter[ROUTER_ADD_ROUTE](routerFile, this[URL_PATH], null, true);
			}
		}

		async [INIT_CHILDREN]() {
			await super[INIT_CHILDREN]();
			this[CREATE_ROUTER_FILE]();
		}

		[ROUTER_ADD_ROUTE](file, path, lazy, wildcard) {
			if (lazy == null) lazy = true;
			if (wildcard == null) wildcard = false;
			this[ROUTER_ROUTES].push({file, path, lazy, wildcard});
		}

		[GET_REACT_ROOT_FILE]() {
			this[CREATE_ROUTER_FILE]();
			return this[REACT_FILE];
		}

		[CREATE_ROUTER_FILE]() {
			const file = this[REACT_ROUTER_FILE];
			if (file.content === '') file.content = createRouter(this[ROUTER_ROUTES]);
			this[REACT_FILE] = file;
		}

		[GET_REACT_ROUTER_FILE]() {
			const files = this[FILES];
			if (!files) return undefined;
			return files['router.jsx'];
		}

		async [PRE_BUILD]() {
			if (super[PRE_BUILD]) await super[PRE_BUILD]();
			deleteRouteProperties(this, [REACT_ROUTER_FILE, ROUTER_ROUTES]);
		}
	}
);
