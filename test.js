'use strict'

const test = require('tape')
const proxyquire = require('proxyquire')
const isPathInside = require('path-is-inside')
const path = require('path')
const r = path.resolve

let mockFiles = []
let spyCalls = []

const roots = proxyquire('.', {
  'find-file-up': function (target, from, done) {
    spyCalls.push([target, from])

    for(let file of mockFiles) {
      if (path.basename(file) === target && isPathInside(from, path.dirname(file))) {
        return process.nextTick(done, null, file)
      }
    }

    process.nextTick(done)
  }
})

test('single file in single root', function (t) {
  t.plan(3)

  mockFiles = [ r('/', 'repo', '.git') ]
  spyCalls = []

  roots([r('/', 'repo', 'aa')], '.git', (err, roots) => {
    t.same(spyCalls, [['.git', r('/', 'repo', 'aa')]], 'find-up called once')
    t.ifError(err, 'no error')
    t.same(roots, [r('/', 'repo')], 'got roots')
  })
})

test('single file without root', function (t) {
  t.plan(2)

  mockFiles = []
  spyCalls = []

  roots([r('/', 'repo', 'aa')], '.git', (err, roots) => {
    t.same(spyCalls, [['.git', r('/', 'repo', 'aa')]], 'find-up called once')
    t.ok(err, 'got error')
  })
})

test('two files in same root', function (t) {
  t.plan(3)

  mockFiles = [ r('/', 'repo', '.git') ]
  spyCalls = []

  roots([r('/', 'repo', 'aa'), r('/', 'repo', 'bb')], '.git', (err, roots) => {
    t.same(spyCalls, [['.git', r('/', 'repo', 'aa')]], 'find-up called once')
    t.ifError(err, 'no error')
    t.same(roots, [r('/', 'repo')], 'got roots')
  })
})

test('two files, one with a root', function (t) {
  t.plan(2)

  mockFiles = [ r('/', 'repo1', '.git') ]
  spyCalls = []

  roots([r('/', 'repo1', 'aa'), r('/', 'repo2', 'bb')], '.git', (err, roots) => {
    t.same(spyCalls, [
      ['.git', r('/', 'repo1', 'aa')],
      ['.git', r('/', 'repo2', 'bb')]
    ], 'find-up called twice')
    t.ok(err, 'got error')
  })
})

test('two files in two roots', function (t) {
  t.plan(3)

  mockFiles = [ r('/', 'repo1', '.git'), r('/', 'repo2', '.git') ]
  spyCalls = []

  roots([r('/', 'repo1', 'aa'), r('/', 'repo2', 'bb')], '.git', (err, roots) => {
    t.same(spyCalls, [
      ['.git', r('/', 'repo1', 'aa')],
      ['.git', r('/', 'repo2', 'bb')]
    ], 'find-up called twice')

    t.ifError(err, 'no error')
    t.same(roots, [r('/', 'repo1'), r('/', 'repo2')], 'got roots')
  })
})
