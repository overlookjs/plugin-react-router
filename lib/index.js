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
	{FILES} = require('@overlook/plugin-load'),
	{URL_PATH} = require('@overlook/plugin-path'),
	{PRE_BUILD, deleteRouteProperties} = require('@overlook/plugin-build'),
	{findParent} = require('@overlook/util-find-parent'),
	assert = require('simple-invariant'),
	{isBoolean} = require('is-it-type');

// Imports
const pkg = require('../package.json'),
	createRouter = require('./createRouter.js'),
	createRouterRoot = require('./createRouterRoot.js');

// Constants
const ROUTER_EXT = 'router.jsx',
	ROUTER_ROOT_EXT = 'routerRoot.jsx';

// Exports

module.exports = new Plugin(
	pkg,
	[fsPlugin, reactPlugin],
	{
		symbols: [
			'REACT_ROUTER_FILE', 'GET_REACT_ROUTER_FILE',
			'REACT_ROUTER_ROOT_FILE', 'GET_REACT_ROUTER_ROOT_FILE',
			'ROUTER_ROUTES', 'CREATE_REACT_ROUTER_FILE', 'CREATE_REACT_ROUTER_ROOT_FILE',
			'ROUTER_IS_LAZY', 'GET_ROUTER_IS_LAZY'
		]
	},
	(Route, {
		REACT_ROUTER_FILE, GET_REACT_ROUTER_FILE, REACT_ROUTER_ROOT_FILE, GET_REACT_ROUTER_ROOT_FILE,
		ROUTER_ROUTES, CREATE_REACT_ROUTER_FILE, CREATE_REACT_ROUTER_ROOT_FILE,
		ROUTER_IS_LAZY, GET_ROUTER_IS_LAZY,
		REACT_FILE, REACT_ROOT, REACT_ROUTER, ROUTER_ADD_ROUTE, WRITE_FILE
	}) => class ReactRouterRoute extends Route {
		/**
		 * Init properties.
		 * @param {Object} props - Props object
		 * @returns {undefined}
		 */
		[INIT_PROPS](props) {
			super[INIT_PROPS](props);
			this[REACT_ROUTER_FILE] = undefined;
			this[REACT_ROUTER_ROOT_FILE] = undefined;
			this[ROUTER_ROUTES] = undefined;
			this[ROUTER_IS_LAZY] = undefined;
		}

		/**
		 * Init route as React router.
		 * Get/create router file.
		 * @returns {undefined}
		 */
		async [INIT_ROUTE]() {
			// Define `[REACT_ROUTER]` before calling superclass, so it's defined
			// before `plugin-react`'s `[INIT_ROUTE]()` method executes.
			this[REACT_ROUTER] = this;

			// Init empty routes array
			this[ROUTER_ROUTES] = [];

			// Delegate to super classes
			await super[INIT_ROUTE]();

			// Get / create router file
			let routerFile = this[REACT_ROUTER_FILE];
			if (!routerFile) {
				routerFile = this[GET_REACT_ROUTER_FILE]();
				// Create empty router file if none exists
				if (!routerFile) routerFile = await this[WRITE_FILE](ROUTER_EXT, '');

				this[REACT_ROUTER_FILE] = routerFile;
			}

			// Get / create root router file
			const isReactRoot = this[REACT_ROOT] === this;
			if (isReactRoot) {
				let rootRouterFile = this[REACT_ROUTER_ROOT_FILE];
				if (!rootRouterFile) {
					rootRouterFile = this[GET_REACT_ROUTER_ROOT_FILE]();
					// Create empty router root file if none exists
					if (!rootRouterFile) rootRouterFile = await this[WRITE_FILE](ROUTER_ROOT_EXT, '');

					this[REACT_ROUTER_ROOT_FILE] = rootRouterFile;
				}
			}

			// Determine if router is lazy-loaded (default is lazy)
			let isLazy = this[ROUTER_IS_LAZY];
			if (isLazy != null) {
				assert(isBoolean(isLazy), '[ROUTER_IS_LAZY] must be true, false, undefined or null');
			} else {
				isLazy = this[GET_ROUTER_IS_LAZY]();
				if (isLazy !== undefined) {
					assert(isBoolean(isLazy), '[GET_ROUTER_IS_LAZY]() must return true, false or undefined');
				} else {
					isLazy = true;
				}
				this[ROUTER_IS_LAZY] = isLazy;
			}

			// If this is not React root, pass router file down to parent router
			if (!isReactRoot) {
				let parentRouter;
				// eslint-disable-next-line no-return-assign
				findParent(this, route => parentRouter = route[REACT_ROUTER]);
				assert(parentRouter, 'A React router must be React root or have a parent React router route');
				parentRouter[ROUTER_ADD_ROUTE](routerFile, this[URL_PATH], isLazy, true);
			}
		}

		/**
		 * Create router file after all child routes initialized.
		 * @returns {undefined}
		 */
		async [INIT_CHILDREN]() {
			await super[INIT_CHILDREN]();
			this[CREATE_REACT_ROUTER_FILE]();
			if (this[REACT_ROOT] === this) this[CREATE_REACT_ROUTER_ROOT_FILE]();
		}

		/**
		 * Add route to router.
		 * @param {Object} file - File object
		 * @param {string} path - URL path
		 * @param {boolean} [isLazy=true] - `true` if route should be lazy-loaded
		 * @param {boolean} [isWildcard=false] - `true` if should match path with wildcard
		 * @returns {undefined}
		 */
		[ROUTER_ADD_ROUTE](file, path, isLazy, isWildcard) {
			if (isLazy == null) isLazy = true;
			if (isWildcard == null) isWildcard = false;
			this[ROUTER_ROUTES].push({file, path, isLazy, isWildcard});
		}

		/**
		 * Create content of router file and over-write `[REACT_FILE]`.
		 * @returns {undefined}
		 */
		[CREATE_REACT_ROUTER_FILE]() {
			const file = this[REACT_ROUTER_FILE];
			if (file.content === '') file.content = createRouter(this[ROUTER_ROUTES]);
			this[REACT_FILE] = file;
		}

		/**
		 * Create content of router root file and over-write `[REACT_FILE]`.
		 * @returns {undefined}
		 */
		[CREATE_REACT_ROUTER_ROOT_FILE]() {
			const file = this[REACT_ROUTER_ROOT_FILE];
			if (file.content === '') file.content = createRouterRoot(this[REACT_FILE]);
			this[REACT_FILE] = file;
		}

		/**
		 * Get router file.
		 * Uses loaded file with ext `.router.jsx` if exists, otherwise returns undefined.
		 * @returns {Object|undefined} - Router file if found
		 */
		[GET_REACT_ROUTER_FILE]() {
			const files = this[FILES];
			if (!files) return undefined;
			return files[ROUTER_EXT];
		}

		/**
		 * Get router root file.
		 * Uses loaded file with ext `.routerRoot.jsx` if exists, otherwise returns undefined.
		 * @returns {Object|undefined} - Router file if found
		 */
		[GET_REACT_ROUTER_ROOT_FILE]() {
			const files = this[FILES];
			if (!files) return undefined;
			return files[ROUTER_ROOT_EXT];
		}

		/**
		 * Get if router is lazy.
		 * Intended to be extended in subclasses.
		 * @returns {boolean|undefined}
		 */
		[GET_ROUTER_IS_LAZY]() { // eslint-disable-line class-methods-use-this
			return undefined;
		}

		/**
		 * If app is built, delete properties not needed at runtime.
		 * @returns {undefined}
		 */
		async [PRE_BUILD]() {
			if (super[PRE_BUILD]) await super[PRE_BUILD]();
			deleteRouteProperties(this, [
				// Properties
				REACT_ROUTER_FILE, REACT_ROUTER_ROOT_FILE, ROUTER_ROUTES, ROUTER_IS_LAZY,
				// Methods
				ROUTER_ADD_ROUTE, CREATE_REACT_ROUTER_FILE, CREATE_REACT_ROUTER_ROOT_FILE,
				GET_REACT_ROUTER_FILE, GET_REACT_ROUTER_ROOT_FILE, GET_ROUTER_IS_LAZY
			]);
		}
	}
);
