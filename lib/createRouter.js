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

module.exports = function createRouter(routes) {
	let importsCode = '',
		lazyCode = '',
		routesCode = '';
	routes.forEach(({file, path, isLazy, isWildcard}, index) => {
		const routeVarName = `Route${index}`;

		if (isLazy) {
			lazyCode += `const ${routeVarName} = lazy(() => import(${stringify(file.path)}));\n`;
		} else {
			importsCode += `import ${routeVarName} from ${stringify(file.path)};\n`;
		}

		routesCode += `    <Route path="${path}"${isWildcard ? '' : ' exact'}><${routeVarName} /></Route>\n`;
	});

	const code = `import React${lazyCode ? ', {lazy}' : ''} from ${stringify(reactPath)};\n`
		+ `import {Switch} from ${stringify(reactRouterPath)};\n\n`
		+ importsCode
		+ lazyCode + '\n'
		+ 'export default () => (\n'
		+ '  <Switch>\n'
		+ routesCode
		+ '  </Switch>\n'
		+ ');\n';

	return code;
};
