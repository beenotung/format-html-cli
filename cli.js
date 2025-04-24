#!/usr/bin/env node

let fs = require('fs')
let path = require('path')

let skipFiles = {
  /* nodejs directories */
  'node_modules': '',
  'data': '',
  'dist': '',
  'build': '',
  '.nyc_output': '',
  'coverage': '',
  '.angular': '',

  /* git directories */
  '.git': '',

  /* python virtual environment */
  'site-packages': '',
  'venv': '',
  '.venv': '',
  '.cache': '',
  'python_modules': '',
}

function scanDir(dir) {
  fs.readdirSync(dir).forEach(file => scanPath(dir, file))
}

function scanPath(dir, filename) {
  if (filename in skipFiles) return
  let file = path.join(dir, filename)
  let stats = fs.lstatSync(file)
  if (stats.isDirectory()) {
    return scanDir(file)
  }
  if (stats.isFile()) {
    return scanFile(file)
  }
}

function scanFile(file) {
  if (path.extname(file) !== '.html') return
  let text = fs.readFileSync(file).toString()
  let newText = text.replace(/^\<\!doctype html\>/i, `<!DOCTYPE html>`)

  if (text === newText) {
    console.log('skip file:', file)
    return
  }
  fs.writeFileSync(file, newText)
  console.log('saved file:', file)
}

scanDir('.')
