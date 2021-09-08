'use strict'

const findUp = require('find-file-up')
const isPathInside = require('path-is-inside')
const path = require('path')

module.exports = function (files, id, opts, done) {
  if (typeof opts === 'function') done = opts, opts = null
  if (!Array.isArray(files)) throw new TypeError('files must be an array')
  if (typeof id !== 'string') throw new TypeError('id file must be a string')

  const roots = []
  const map = opts && opts.map ? {} : null

  next(0)

  function next (i) {
    while (i < files.length) {
      const file = path.resolve(files[i++])
      const root = roots.find(root => isPathInside(file, root))

      if (root !== undefined) {
        if (map !== null) {
          map[file] = root
        }
      } else {
        return patchedFindUp(id, file, (err, rootFile) => {
          if (err) return done(err)

          if (!rootFile) {
            return done(new Error(
              `Failed to find root file "${id}" from "${file}"`
            ))
          }

          const root = path.dirname(rootFile)
          roots.push(root)

          if (map !== null) {
            map[file] = root
          }

          next(i)
        })
      }
    }

    done(null, roots, map)
  }
}

function patchedFindUp(id, file, callback) {
  file = path.resolve(file)

  findUp(id, file, (err, result) => {
    // TODO: fix this in `find-file-up`. Atm it ignores a ENOENT upon fs.stat(),
    // should also ignore ENOTDIR. The ENOTDIR happens on a path like /file.js/foo
    if (err && err.code === 'ENOTDIR') {
      const parent = path.dirname(file)
      if (parent !== file) return patchedFindUp(id, parent, callback)
    }

    callback(err, result)
  })
}
