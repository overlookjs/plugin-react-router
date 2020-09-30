/* --------------------
 * @overlook/plugin-react-router module
 * Create router file
 * ------------------*/

/* eslint-disable prefer-template */

'use strict';

// Modules
const pathJoin = require('path').join;

// Exports

const reactPath = require.resolve('@overlook/plugin-react/react'),
	reactRouterPath = pathJoin(__dirname, '../react-router-dom.js');

const {stringify} = JSON;

module.exports = function createRouter(routes) {
	let importsCode = '',
		lazyCode = '',
		routesCode = '';
	routes.forEach(({file, path, lazy, wildcard}, index) => {
		const routeVarName = `Route${index}`;

		if (lazy) {
			lazyCode += `const ${routeVarName} = lazy(() => import(${stringify(file.path)}));\n`;
		} else {
			importsCode += `import ${routeVarName} from ${stringify(file.path)};\n`;
		}

		routesCode += `    <Route path="${path}"${wildcard ? '' : ' exact'}><${routeVarName} /></Route>\n`;
	});

	let code = `import React${lazyCode ? ', {lazy}' : ''} from ${stringify(reactPath)};\n`
		+ `import {Switch} from ${stringify(reactRouterPath)};\n\n`
		+ importsCode
		+ lazyCode + '\n';

	code += 'export default () => (\n'
		+ '  <Switch>\n'
		+ routesCode
		+ '  </Switch>\n'
		+ ');\n';

	return code;
};
