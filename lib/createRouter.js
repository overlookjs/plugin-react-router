/* --------------------
 * @overlook/plugin-react-router module
 * Create router file
 * ------------------*/

/* eslint-disable prefer-template */

'use strict';

// Exports

const reactPath = require.resolve('@overlook/plugin-react/react'),
	reactRouterPath = require.resolve('react-router-dom');

const {stringify} = JSON;

/**
 * Make router file content.
 * @param {Array<Object>} routes - Route objects of form `{file, path, isLazy, isWildcard}`
 * @returns {string} - Router file content
 */
module.exports = function createRouter(routes) {
	let importsCode = '',
		routesCode = '',
		usesLazy = false;
	routes.forEach(({file, path, isLazy, isWildcard}, index) => {
		const routeVarName = `Route${index}`;

		if (isLazy) {
			importsCode += `const ${routeVarName} = lazy(() => import(/* webpackChunkName: "${pathToChunkName(path, isWildcard)}" */ ${stringify(file.path)}));\n`;
			usesLazy = true;
		} else {
			importsCode += `import ${routeVarName} from ${stringify(file.path)};\n`;
		}

		routesCode += `    <Route path="${path}"${isWildcard ? '' : ' exact'}><${routeVarName} /></Route>\n`;
	});

	const code = `import React${usesLazy ? ', {lazy}' : ''} from ${stringify(reactPath)};\n`
		+ `import {Switch} from ${stringify(reactRouterPath)};\n\n`
		+ importsCode + '\n'
		+ 'export default () => (\n'
		+ '  <Switch>\n'
		+ routesCode
		+ '  </Switch>\n'
		+ ');\n';

	return code;
};

/**
 * Convert path to chunk name.
 *
 * `/` -> `routeRoot`
 * `/foo/bar/qux` -> `routeFooBarQux`
 *
 * If `isWildcard` is true, prefix is 'router' instead of 'route'.
 * Characters other than A-Z, a-z, 0-9 and '.' are replaced with '_'.
 *
 * @param {string} path - URL path
 * @param {boolean} isWildcard - `true` if is wildcard match i.e. router
 * @returns {string} - Chunk name
 */
function pathToChunkName(path, isWildcard) {
	const prefix = isWildcard ? 'router' : 'route';
	const name = path === '/'
		? 'Root'
		: path.replace(/\/(.)/g, (_, c) => c.toUpperCase())
			.replace(/[^A-Za-z0-9_.]/g, '_');
	return `${prefix}${name}`;
}
