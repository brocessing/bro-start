const sh = require('kool-shell')
const fs = require('fs-extra')
const steps = 5
const copyOptions = {
  clobber: true,
  dereference: false,
  preserveTimestamps: true
}

function ghpages ({
    cachePath,
    copyPath,
    quiet = false,
    cwd = process.cwd(),
    force = false } = {}) {
  let remote = ''

  const api = {
    deploy
  }

  function deploy (commitMessage = 'Update gh-pages :package:') {
    return new Promise((resolve, reject) => {
      isEverythingCommit()
        .then(getRemoteGit)
        .then((res) => { remote = res })
        .then(() => {
          if (!quiet) sh.step(1, steps, 'Rebuilding cache folder...')
        })
        .then(removeCacheFolder)
        .then(createCacheFolder)
        .then(getRemoteGit)
        .then(() => {
          if (!quiet) sh.step(2, steps, 'Init git and gh-pages branch...')
        })
        .then(gitInit)
        .then(addRemoteOrigin)
        .then(checkoutGhPages)
        .then(() => {
          if (!quiet) sh.step(3, steps, 'Copying dist folder...')
        })
        .then(copyFiles)
        .then(() => commitAndPush(commitMessage))
        .then(removeCacheFolder)
        .then(() => { resolve() })
        .catch(reject)
    })
  }

  function getRemoteGit () {
    let errorMsg = 'No remote repository ! Deploy Failed.'
    return new Promise((resolve, reject) => {
      sh.silentExec('git', ['config', '--get', 'remote.origin.url'], {cwd: cwd})
        .then((res) => {
          if (!res || res === '') {
            return reject('errorMsg')
          }
          remote = res
          resolve(res)
        })
        .catch((e) => { reject(errorMsg) })
    })
  }

  function gitInit () {
    return sh.silentExec('git', ['init'], { cwd: cachePath })
  }

  function addRemoteOrigin () {
    return sh.silentExec('git',
      ['remote', 'add', 'origin', remote],
      { cwd: cachePath })
  }

  function removeCacheFolder () {
    return new Promise((resolve, reject) => {
      fs.remove(cachePath, e => e ? reject(e) : resolve())
    })
  }

  function createCacheFolder () {
    return new Promise((resolve, reject) => {
      fs.mkdirp(cachePath, e => e ? reject(e) : resolve())
    })
  }

  function isEverythingCommit () {
    if (force) return Promise.resolve()
    return new Promise((resolve, reject) => {
      sh.silentExec('git', ['status', '--porcelain'], {cwd: cwd})
        .then((res) => {
          if (res !== '') reject('Uncommitted git changes! Deploy failed.')
          else resolve()
        })
        .catch(reject)
    })
  }

  function copyFiles () {
    return new Promise((resolve, reject) => {
      fs.copy(copyPath, cachePath, copyOptions, e => e ? reject(e) : resolve())
    })
  }

  function checkoutGhPages () {
    return new Promise((resolve, reject) => {
      sh.silentExec('git',
        ['show-ref', '--verify', '--quiet', 'refs/heads/gh-pages'],
        {cwd: cachePath})
        .then(() => {
          sh.silentExec('git', ['checkout', 'gh-pages'], {cwd: cachePath})
            .then(resolve, reject)
        })
        .catch((e) => {
          sh.silentExec('git', ['checkout', '-b', 'gh-pages'], {cwd: cachePath})
            .then(resolve, reject)
        })
    })
  }

  function commitAndPush (commitMessage) {
    return new Promise((resolve, reject) => {
      if (!quiet) sh.step(4, steps, 'Adding files and commit...')
      sh.silentExec('git', ['add', '-A'], {cwd: cachePath})
        .then(() => sh.silentExec('git',
          ['commit', '-m', commitMessage],
          {cwd: cachePath}))
        .catch(e => '') // mute error if there is nothing to commit
        .then(() => {
          if (!quiet) sh.step(5, steps, 'Pushing files - it can take a moment...')
        })
        .then(() => sh.silentExec('git',
          ['push', 'origin', 'gh-pages', '--force'],
          {cwd: cachePath}))
        .then(resolve)
        .catch(reject)
    })
  }

  return api
}

module.exports = ghpages
