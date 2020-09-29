/* --------------------
 * @overlook/plugin-react-router module
 * Tests ESLint config
 * ------------------*/

'use strict';

// Exports

module.exports = {
	extends: [
		'@overlookmotel/eslint-config-jest'
	],
	rules: {
		'import/no-unresolved': ['error', {ignore: ['^@overlook/plugin-react-router(/|$)']}],
		'node/no-missing-require': ['error', {allowModules: ['@overlook/plugin-react-router']}],
		'node/no-missing-import': ['error', {allowModules: ['@overlook/plugin-react-router']}]
	},
	overrides: [{
		files: ['*.mjs'],
		parserOptions: {
			sourceType: 'module'
		},
		rules: {
			'node/no-unsupported-features/es-syntax': ['error', {ignores: ['modules']}]
		}
	}]
};
