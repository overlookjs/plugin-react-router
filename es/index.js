/* --------------------
 * @overlook/plugin-react-router module
 * ESM entry point
 * Re-export CJS with named exports
 * ------------------*/

// Exports

import reactRouterPlugin from '../lib/index.js';

export default reactRouterPlugin;
export const {
	REACT_ROUTER_FILE,
	GET_REACT_ROUTER_FILE,
	REACT_ROUTER_ROOT_FILE,
	GET_REACT_ROUTER_ROOT_FILE,
	ROUTER_ROUTES,
	CREATE_ROUTER_FILE,
	CREATE_ROUTER_ROOT_FILE,
	ROUTER_IS_LAZY,
	GET_ROUTER_IS_LAZY
} = reactRouterPlugin;
