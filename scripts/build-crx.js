#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const platform = require('os').platform()
const { exec, execSync } = require('child_process')
const packageJSON = require('../package.json')

const CMDS = ['chromium', 'chrome']
const DEST_DIR = path.join(__dirname, '../dist')
const ROOT_DIR = path.dirname(DEST_DIR)
const CRX_NAME = path.basename(DEST_DIR)
const CRX_FILE_PATH = path.join(ROOT_DIR, CRX_NAME + '.crx')
const CRX_PEM_PATH = path.join(ROOT_DIR, CRX_NAME + '.pem')

function isExec (command) {
  try {
    execSync(command)
    return true
  } catch (_e) {
    return false
  }
}

function findCommand (command) {
  if (/^win/.test(platform)) {
    return 'where ' + command
  } else {
    return 'command -v ' + command
  }
}

function getCommand (commands) {
  let command
  commands.some((cmd) => {
    if (isExec(findCommand(cmd))) {
      command = cmd
      return true
    } else {
      return false
    }
  })
  return command
}

function getCRXName (string) {
  string = string.charAt(0).toUpperCase() + string.slice(1)
  return string.split(/[ -]+/).reduce(function (prev, cur) {
    return prev + cur.charAt(0).toUpperCase() + cur.slice(1)
  })
}

const main = () => {
  const command = getCommand(CMDS)
  // if (!command) throw new Error("Couldn't find chromium or chrome")
  /* eslint-disable no-console */
  if (!command) return console.error("Couldn't find chromium or chrome")

  exec(command + ' --pack-extension=' + DEST_DIR, { cwd: ROOT_DIR }, (err, stdout, stderr) => {
    if (err) throw err
    fs.stat(CRX_FILE_PATH, (err, stats) => {
      if (err) throw err
      fs.renameSync(CRX_FILE_PATH, path.join(ROOT_DIR, getCRXName(packageJSON.name) + '.crx'))
    })

    fs.stat(CRX_PEM_PATH, (err, stats) => {
      if (err) throw err
      if (stats.isFile()) { fs.unlinkSync(CRX_PEM_PATH) }
    })
  })
}

main()
