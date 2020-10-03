/* --------------------
 * @overlook/plugin-react-router module
 * Create router root file
 * ------------------*/

'use strict';

// Exports

const reactPath = require.resolve('@overlook/plugin-react/react'),
	reactRouterPath = require.resolve('react-router-dom');

const {stringify} = JSON;

/**
 * Make router root file content.
 * @param {Object} file - File object for router
 * @returns {string} - Router root file content
 */
module.exports = function createRouter(file) {
	const {path} = file;
	return `import React from ${stringify(reactPath)};\n`
		+ `import {BrowserRouter as Router} from ${stringify(reactRouterPath)};\n\n`
		+ `import Route from ${stringify(path)};\n\n`
		+ 'export default () => <Router><Route /></Router>;\n';
};
