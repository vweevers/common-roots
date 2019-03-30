# common-roots

**Given some files, find their root directories (containing some identifying file like `.git`, `package.json`, etc). For files in the same root directory, it does a single lookup.**

[![npm status](http://img.shields.io/npm/v/common-roots.svg?style=flat-square)](https://www.npmjs.org/package/common-roots) [![node](https://img.shields.io/node/v/common-roots.svg?style=flat-square)](https://www.npmjs.org/package/common-roots) [![Travis build status](https://img.shields.io/travis/vweevers/common-roots.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/common-roots) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/common-roots.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/common-roots) [![Dependency status](https://img.shields.io/david/vweevers/common-roots.svg?style=flat-square)](https://david-dm.org/vweevers/common-roots) [![Greenkeeper badge](https://badges.greenkeeper.io/vweevers/common-roots.svg)](https://greenkeeper.io/)

## example

```js
const roots = require('common-roots')
const files = ['/repo1/a.js', '/repo2/lib', '/repo1/a/b/c']

roots(files, '.git', (err, roots) => {
  // roots is ['/repo1', '/repo2']
})
```

## `roots(files, id, done)`

- files: array of files (relative paths are resolved from cwd)
- id: relative path to some file that identifies the root directory
- callback: receives an error (if one of the files has no root directory) or an array of absolute root directories.

## install

With [npm](https://npmjs.org) do:

```
npm install common-roots
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
