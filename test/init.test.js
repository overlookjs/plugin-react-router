/* --------------------
 * @overlook/plugin-react-router module
 * Init tests
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pathPlugin = require('@overlook/plugin-path'),
	reactPlugin = require('@overlook/plugin-react'),
	reactRouterPlugin = require('@overlook/plugin-react-router'),
	{FILES} = require('@overlook/plugin-load'),
	{
		REACT_ROUTER_FILE, GET_REACT_ROUTER_FILE, REACT_ROUTER_ROOT_FILE, GET_REACT_ROUTER_ROOT_FILE,
		ROUTER_IS_LAZY, GET_ROUTER_IS_LAZY, ROUTER_ROUTES,
		REACT_ROOT, REACT_FILE, IS_LAZY, FS_FILES, File
	} = reactRouterPlugin;

// Init
const {spy} = require('./support/index.js');

// Tests

const ReactRouterRoute = Route.extend(reactRouterPlugin),
	PathRoute = Route.extend(pathPlugin),
	ReactRouterPathRoute = PathRoute.extend(reactRouterPlugin),
	ReactPathRoute = PathRoute.extend(reactPlugin);

describe('Init', () => {
	describe('`[INIT_PROPS]()` defines undefined', () => {
		it.each([
			'REACT_ROUTER_FILE',
			'REACT_ROUTER_ROOT_FILE',
			'ROUTER_ROUTES',
			'ROUTER_IS_LAZY'
		])('%s', (propName) => {
			const route = new ReactRouterRoute();

			const symbol = reactRouterPlugin[propName];
			expect(typeof symbol).toBe('symbol');
			expect(route).toContainEntry([symbol, undefined]);
		});
	});

	describe('determines `[REACT_ROUTER_FILE]`', () => {
		it(
			'from `[GET_REACT_ROUTER_FILE]()` if `[REACT_ROUTER_FILE]` undefined',
			async () => {
				const route = new ReactRouterRoute();
				route[REACT_ROOT] = route;
				const file = new File('/a/b/c');
				route[GET_REACT_ROUTER_FILE] = () => file;
				await route.init();
				expect(route[REACT_ROUTER_FILE]).toBe(file);
			}
		);

		it("from `[FILES]['router.jsx']` if `[REACT_ROUTER_FILE]` undefined", async () => {
			const route = new ReactRouterRoute();
			route[REACT_ROOT] = route;
			const file = new File('/a/b/c');
			route[FILES] = {'router.jsx': file};
			await route.init();
			expect(route[REACT_ROUTER_FILE]).toBe(file);
		});

		it(
			'does not call `[GET_REACT_ROUTER_FILE]()` if `[REACT_ROUTER_FILE]` defined',
			async () => {
				const route = new ReactRouterRoute();
				route[REACT_ROOT] = route;
				const file = new File('/a/b/c');
				route[REACT_ROUTER_FILE] = file;
				route[GET_REACT_ROUTER_FILE] = spy(() => {});
				await route.init();
				expect(route[REACT_ROUTER_FILE]).toBe(file);
				expect(route[GET_REACT_ROUTER_FILE]).not.toHaveBeenCalled();
			}
		);

		it(
			'creates file if `[REACT_ROUTER_FILE]` undefined and `[GET_REACT_ROUTER_FILE]()` returns undefined',
			async () => {
				const route = new ReactRouterRoute();
				route[REACT_ROOT] = route;
				await route.init();
				expect(route[REACT_ROUTER_FILE]).toBeObject();
				expect(route[REACT_ROUTER_FILE].path).toBe('?/anon.router.jsx');
			}
		);
	});

	describe('determines `[REACT_ROUTER_ROOT_FILE]`', () => {
		it(
			'from `[GET_REACT_ROUTER_ROOT_FILE]()` if `[REACT_ROUTER_ROOT_FILE]` undefined',
			async () => {
				const route = new ReactRouterRoute();
				route[REACT_ROOT] = route;
				const file = new File('/a/b/c');
				route[GET_REACT_ROUTER_ROOT_FILE] = () => file;
				await route.init();
				expect(route[REACT_ROUTER_ROOT_FILE]).toBe(file);
			}
		);

		it("from `[FILES]['routerRoot.jsx']` if `[REACT_ROUTER_ROOT_FILE]` undefined", async () => {
			const route = new ReactRouterRoute();
			route[REACT_ROOT] = route;
			const file = new File('/a/b/c');
			route[FILES] = {'routerRoot.jsx': file};
			await route.init();
			expect(route[REACT_ROUTER_ROOT_FILE]).toBe(file);
		});

		it(
			'does not call `[GET_REACT_ROUTER_ROOT_FILE]()` if `[REACT_ROUTER_ROOT_FILE]` defined',
			async () => {
				const route = new ReactRouterRoute();
				route[REACT_ROOT] = route;
				const file = new File('/a/b/c');
				route[REACT_ROUTER_ROOT_FILE] = file;
				route[GET_REACT_ROUTER_ROOT_FILE] = spy(() => {});
				await route.init();
				expect(route[REACT_ROUTER_ROOT_FILE]).toBe(file);
				expect(route[GET_REACT_ROUTER_ROOT_FILE]).not.toHaveBeenCalled();
			}
		);

		it(
			'creates file if `[REACT_ROUTER_ROOT_FILE]` undefined and `[GET_REACT_ROUTER_ROOT_FILE]()` returns undefined',
			async () => {
				const route = new ReactRouterRoute();
				route[REACT_ROOT] = route;
				await route.init();
				expect(route[REACT_ROUTER_ROOT_FILE]).toBeObject();
				expect(route[REACT_ROUTER_ROOT_FILE].path).toBe('?/anon.routerRoot.jsx');
			}
		);
	});

	describe('determines `[ROUTER_IS_LAZY]`', () => {
		it(
			'true as default if `[ROUTER_IS_LAZY]` undefined and `[GET_ROUTER_IS_LAZY]()` returns undefined',
			async () => {
				const route = new ReactRouterRoute();
				route[REACT_ROOT] = route;
				await route.init();
				expect(route[ROUTER_IS_LAZY]).toBe(true);
			}
		);

		it('from `[GET_ROUTER_IS_LAZY]()` if `[ROUTER_IS_LAZY]` undefined', async () => {
			const route = new ReactRouterRoute();
			route[REACT_ROOT] = route;
			route[GET_ROUTER_IS_LAZY] = () => false;
			await route.init();
			expect(route[ROUTER_IS_LAZY]).toBe(false);
		});

		it('does not call `[GET_ROUTER_IS_LAZY]()` if `[ROUTER_IS_LAZY]` defined', async () => {
			const route = new ReactRouterRoute();
			route[REACT_ROOT] = route;
			route[ROUTER_IS_LAZY] = true;
			route[GET_ROUTER_IS_LAZY] = spy(() => false);
			await route.init();
			expect(route[ROUTER_IS_LAZY]).toBe(true);
			expect(route[GET_ROUTER_IS_LAZY]).not.toHaveBeenCalled();
		});
	});

	describe('routes', () => {
		let root, child1, child2, child1OfChild1, child2OfChild1,
			childRouter1, childRouter2, child1OfChildRouter1, child2OfChildRouter1,
			fileRoot, fileChild1, fileChild2, fileChild1OfChild1, fileChild2OfChild1,
			fileChildRouter1, fileChildRouter2, fileChild1OfChildRouter1, fileChild2OfChildRouter1;
		beforeEach(async () => {
			fileRoot = new File('/index.jsx');
			root = new ReactRouterPathRoute({[REACT_FILE]: fileRoot});
			root[REACT_ROOT] = root;

			fileChild1 = new File('/child1.jsx');
			child1 = new ReactPathRoute({
				name: 'child1',
				[REACT_FILE]: fileChild1
			});
			root.attachChild(child1);

			fileChild2 = new File('/child2.jsx');
			child2 = new ReactPathRoute({
				name: 'child2',
				[REACT_FILE]: fileChild2,
				[IS_LAZY]: false
			});
			root.attachChild(child2);

			fileChild1OfChild1 = new File('/child1OfChild1.jsx');
			child1OfChild1 = new ReactPathRoute({
				name: 'child1OfChild1',
				[REACT_FILE]: fileChild1OfChild1
			});
			child1.attachChild(child1OfChild1);

			fileChild2OfChild1 = new File('/child2OfChild1.jsx');
			child2OfChild1 = new ReactPathRoute({
				name: 'child2OfChild1',
				[REACT_FILE]: fileChild2OfChild1,
				[IS_LAZY]: false
			});
			child1.attachChild(child2OfChild1);

			fileChildRouter1 = new File('/childRouter1.jsx');
			childRouter1 = new ReactRouterPathRoute({
				name: 'childRouter1',
				[REACT_FILE]: fileChildRouter1
			});
			root.attachChild(childRouter1);

			fileChildRouter2 = new File('/childRouter2.jsx');
			childRouter2 = new ReactRouterPathRoute({
				name: 'childRouter2',
				[REACT_FILE]: fileChildRouter2,
				[ROUTER_IS_LAZY]: false
			});
			root.attachChild(childRouter2);

			fileChild1OfChildRouter1 = new File('/child1OfChildRouter1.jsx');
			child1OfChildRouter1 = new ReactPathRoute({
				name: 'child1OfChildRouter1',
				[REACT_FILE]: fileChild1OfChildRouter1
			});
			childRouter1.attachChild(child1OfChildRouter1);

			fileChild2OfChildRouter1 = new File('/child2OfChildRouter1.jsx');
			child2OfChildRouter1 = new ReactPathRoute({
				name: 'child2OfChildRouter1',
				[REACT_FILE]: fileChild2OfChildRouter1,
				[IS_LAZY]: false
			});
			childRouter1.attachChild(child2OfChildRouter1);

			await root.init();
		});

		describe('adds to `[ROUTER_ROUTES]`', () => {
			it('root', () => {
				const routeRecord = root[ROUTER_ROUTES][0];
				expect(routeRecord).toEqual({file: fileRoot, path: '/', isLazy: true, isWildcard: false});
				expect(routeRecord.file).toBe(fileRoot);
			});

			it('child', () => {
				const routeRecord = root[ROUTER_ROUTES][1];
				expect(routeRecord).toEqual({file: fileChild1, path: '/child1', isLazy: true, isWildcard: false});
				expect(routeRecord.file).toBe(fileChild1);
			});

			it('child with `[IS_LAZY]` false', () => {
				const routeRecord = root[ROUTER_ROUTES][2];
				expect(routeRecord).toEqual({file: fileChild2, path: '/child2', isLazy: false, isWildcard: false});
				expect(routeRecord.file).toBe(fileChild2);
			});

			it('nested child', () => {
				const routeRecord = root[ROUTER_ROUTES][3];
				expect(routeRecord).toEqual({
					file: fileChild1OfChild1, path: '/child1/child1OfChild1', isLazy: true, isWildcard: false
				});
				expect(routeRecord.file).toBe(fileChild1OfChild1);
			});

			it('nested child with `[IS_LAZY]` false', () => {
				const routeRecord = root[ROUTER_ROUTES][4];
				expect(routeRecord).toEqual({
					file: fileChild2OfChild1, path: '/child1/child2OfChild1', isLazy: false, isWildcard: false
				});
				expect(routeRecord.file).toBe(fileChild2OfChild1);
			});

			describe('nested routers', () => {
				it('nested router', () => {
					const routeRecord = root[ROUTER_ROUTES][5];
					expect(routeRecord).toEqual({
						file: expect.objectContaining({path: '?/childRouter1.router.jsx'}),
						path: '/childRouter1',
						isLazy: true,
						isWildcard: true
					});
				});

				it('nested router with `[ROUTER_IS_LAZY]` false', () => {
					const routeRecord = root[ROUTER_ROUTES][6];
					expect(routeRecord).toEqual({
						file: expect.objectContaining({path: '?/childRouter2.router.jsx'}),
						path: '/childRouter2',
						isLazy: false,
						isWildcard: true
					});
				});

				describe('`[ROUTER_ROUTES]` of nested router contains', () => {
					it('own file', () => {
						const routeRecord = childRouter1[ROUTER_ROUTES][0];
						expect(routeRecord).toEqual({
							file: fileChildRouter1, path: '/childRouter1', isLazy: true, isWildcard: false
						});
						expect(routeRecord.file).toBe(fileChildRouter1);
					});

					it('child', () => {
						const routeRecord = childRouter1[ROUTER_ROUTES][1];
						expect(routeRecord).toEqual({
							file: fileChild1OfChildRouter1,
							path: '/childRouter1/child1OfChildRouter1',
							isLazy: true,
							isWildcard: false
						});
						expect(routeRecord.file).toBe(fileChild1OfChildRouter1);
					});

					it('child with `[IS_LAZY]` false', () => {
						const routeRecord = childRouter1[ROUTER_ROUTES][2];
						expect(routeRecord).toEqual({
							file: fileChild2OfChildRouter1,
							path: '/childRouter1/child2OfChildRouter1',
							isLazy: false,
							isWildcard: false
						});
						expect(routeRecord.file).toBe(fileChild2OfChildRouter1);
					});
				});
			});
		});

		describe('creates router files', () => {
			it('root wrapper', () => {
				const file = root[REACT_FILE];
				expect(root[FS_FILES]['?/anon.routerRoot.jsx']).toBe(file);
				expect(file).toBeObject();
				expect(file.path).toBe('?/anon.routerRoot.jsx');
				expect(file.content).toBeString();
				expect(file.content.trim().split(/\n+/)).toEqual([
					expect.stringMatching(/^import React from "[^"]+";$/),
					expect.stringMatching(/^import \{BrowserRouter as Router\} from "[^"]+";$/),
					'import Route from "?/anon.router.jsx";',
					'export default () => <Router><Route /></Router>;'
				]);
			});

			it('root router', () => {
				const file = root[FS_FILES]['?/anon.router.jsx'];
				expect(file).toBeObject();
				expect(file.path).toBe('?/anon.router.jsx');
				expect(file.content.trim().split(/\n+/)).toEqual([
					expect.stringMatching(/^import React, \{lazy\} from "[^"]+";$/),
					expect.stringMatching(/^import \{Switch\} from "[^"]+";$/),
					'const Route0 = lazy(() => import("/index.jsx"));',
					'const Route1 = lazy(() => import("/child1.jsx"));',
					'import Route2 from "/child2.jsx";',
					'const Route3 = lazy(() => import("/child1OfChild1.jsx"));',
					'import Route4 from "/child2OfChild1.jsx";',
					'const Route5 = lazy(() => import("?/childRouter1.router.jsx"));',
					'import Route6 from "?/childRouter2.router.jsx";',
					'export default () => (',
					'  <Switch>',
					'    <Route path="/" exact><Route0 /></Route>',
					'    <Route path="/child1" exact><Route1 /></Route>',
					'    <Route path="/child2" exact><Route2 /></Route>',
					'    <Route path="/child1/child1OfChild1" exact><Route3 /></Route>',
					'    <Route path="/child1/child2OfChild1" exact><Route4 /></Route>',
					'    <Route path="/childRouter1"><Route5 /></Route>',
					'    <Route path="/childRouter2"><Route6 /></Route>',
					'  </Switch>',
					');'
				]);
			});

			it('child router 1', () => {
				const file = root[FS_FILES]['?/childRouter1.router.jsx'];
				expect(file).toBeObject();
				expect(file.path).toBe('?/childRouter1.router.jsx');
				expect(file.content.trim().split(/\n+/)).toEqual([
					expect.stringMatching(/^import React, \{lazy\} from "[^"]+";$/),
					expect.stringMatching(/^import \{Switch\} from "[^"]+";$/),
					'const Route0 = lazy(() => import("/childRouter1.jsx"));',
					'const Route1 = lazy(() => import("/child1OfChildRouter1.jsx"));',
					'import Route2 from "/child2OfChildRouter1.jsx";',
					'export default () => (',
					'  <Switch>',
					'    <Route path="/childRouter1" exact><Route0 /></Route>',
					'    <Route path="/childRouter1/child1OfChildRouter1" exact><Route1 /></Route>',
					'    <Route path="/childRouter1/child2OfChildRouter1" exact><Route2 /></Route>',
					'  </Switch>',
					');'
				]);
			});

			it('child router 2', () => {
				const file = root[FS_FILES]['?/childRouter2.router.jsx'];
				expect(file).toBeObject();
				expect(file.path).toBe('?/childRouter2.router.jsx');
				expect(file.content.trim().split(/\n+/)).toEqual([
					expect.stringMatching(/^import React, \{lazy\} from "[^"]+";$/),
					expect.stringMatching(/^import \{Switch\} from "[^"]+";$/),
					'const Route0 = lazy(() => import("/childRouter2.jsx"));',
					'export default () => (',
					'  <Switch>',
					'    <Route path="/childRouter2" exact><Route0 /></Route>',
					'  </Switch>',
					');'
				]);
			});
		});
	});
});
