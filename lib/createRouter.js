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
		routesCode = '',
		usesLazy = false;
	routes.forEach(({file, path, isLazy, isWildcard}, index) => {
		const routeVarName = `Route${index}`;

		if (isLazy) {
			importsCode += `const ${routeVarName} = lazy(() => import(${stringify(file.path)}));\n`;
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
