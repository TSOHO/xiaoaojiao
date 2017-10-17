const mkdirp = require('mkdirp')
const unzip = require('unzip')
const ncp = require('ncp')

const fs = require('fs')
const path = require('path')

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
