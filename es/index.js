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
	ROUTER_ROUTES,
	ADD_ROUTE,
	CREATE_ROUTER_FILE
} = reactRouterPlugin;
