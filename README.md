# HashMap

A drop-in replacement for the ES6 Map class that can use objects and arrays as keys with deep equality checks.

## Installation

```bash
npm install hash-map
```

## Usage

`HashMap` implements the same interface as [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
Keys can be any combination of objects, arrays and primitives.

```javascript
import { HashMap } from 'hash-map';

const map = new HashMap();
map.set({ foo: 'bar' }, 42);

console.log(map.get({ foo: 'bar' })); // 42

console.log(map.has({ bar: 'foo' })); // false

console.log(map.delete({ foo: 'bar' })); // true

// Iterators are implemented with no guarantee on ordering
console.log([...map.keys()]); // [ { foo: 'bar' } ]
console.log([...map.values()]); // [ 42 ]
console.log([...map.entries()]); // [ [ { foo: 'bar' }, 42 ] ]
```

`HashMap` supports TypeScript generics for key and value types.

```typescript
import { HashMap } from 'hash-map';

const map = new HashMap<string, number>();
map.set('foo', 42); // ok
map.set({ foo: 'bar' }, 42); // error
```

Circular references are not supported in keys.

## Development

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

### Linting

Code quality is set up with `prettier`, `husky`, and `lint-staged`.

### Tests

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of the library with `npm run size` and visualize the bundle with `npm run analyze`.

## Continuous Integration

### GitHub Actions

Two actions are used:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)
