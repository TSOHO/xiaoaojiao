const mkdirp = require('mkdirp')
const unzip = require('unzip')
const ncp = require('ncp')

const fs = require('fs')
const path = require('path')

const ignore = ['.git', '.history', 'node_modules']

/**
 * 新建文件夹
 */
exports._mkdir = path => {
  return new Promise(function (resolve, reject) {
    mkdirp(path, function (err) {
      if (err) {
        reject(err)
      } else {
        setTimeout(() => resolve(path), 100)
      }
    })
  })
}

/**
 * 解压
 *
 * @param {any} zip
 * @param {any} path
 */
exports._unzip = (zip, path) => {
  return new Promise(function (resolve, reject) {
    fs.createReadStream(zip)
    .pipe(unzip.Extract({
      path: path
    }))
    .on('finish', resolve(zip))
  })
}

/**
 * 字节转mb、kb
 */
exports.formatSize = (size) => {
  return size >= 1048576 ? (size / 1048576).toFixed(2) + 'MB' : (size / 1024).toFixed(2) + 'KB'
}

/**
 * 复制
 */
exports._clone = (from, to) => {
  return new Promise(function (resolve, reject) {
    const dest = path.resolve(to)

    ncp.limit = 16
    ncp(from, dest, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

/**
 * 获取一级目录
 * @param {*} root
 */
const getDirectory = (root) => {
  let res = []
  let files = fs.readdirSync(root)

  for (const item of files) {
    let pathname = root + '/' + item
    let stat = fs.lstatSync(pathname)

    if (stat.isDirectory() && ignore.indexOf(item) === -1) {
      res.push(pathname)
    }
  }
  return res
}
/**
 * [getFilesList 获取目录下所有文件列表]
 * @param {[string]} root [收集的目录]
 * @return {[array]} list 收集到的文件列表
 */
const getFilesList = (root) => {
  let res = []
  let files = fs.readdirSync(root)

  files.forEach(function (file) {
    let pathname = root + '/' + file
    let stat = fs.lstatSync(pathname)
    let ok = false

    for (const item of ignore) {
      if (item === file) {
        ok = true
      }
    }

    if (ok) {
      return
    }

    if (!stat.isDirectory()) {
      if (!/^\./.test(file)) {
        res.push(pathname.replace(/\/\//g, '/'))
      }
    } else {
      res = res.concat(getFilesList(pathname))
    }
  })
  return res
}

exports.getFilesList = getFilesList
exports.getDirectory = getDirectory
