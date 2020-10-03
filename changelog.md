# Changelog

## 0.1.2

Bug fixes:

* Wrap router in `<Suspense>`

## 0.1.1

Refactor:

* Rename `CREATE_` methods
* Shorten + rename `createRouterRoot` function
* Re-order imports

## 0.1.0

Breaking changes:

* Inherit `[ROUTER_ADD_ROUTE]` method from `plugin-react`
* Remove `[GET_REACT_ROOT_FILE]` method

Features:

* Lazy routers
* Add `webpackChunkName` for dynamic imports

Improvements:

* Mandate parent router if this is not React root

Performance:

* Delete methods not needed at runtime from build

Bug fixes:

* Fix finding parent router
* Fix error getting router file
* Wrap root in `<Router>`
* Init `[ROUTER_ROUTES]` before delegating to super in init

Dependencies:

* Update `@overlook/plugin-react` dependency

Refactor:

* Use constant for router file ext
* Rename `[ROUTER_ADD_ROUTE]` args
* Simplify resolve path to `react-router-dom`
* Shorten constructing router JSX
* Create routes in order in router file

No code:

* Code comments

Tests:

* Add tests

## 0.0.1

* Initial release
