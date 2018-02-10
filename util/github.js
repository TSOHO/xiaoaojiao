const request = require('request')

const path = require('path')

const organization = 'TSOHO'
const headers = {
  'User-Agent': 'TSOHO-template'
}
  /**
   * 获取organization所有模板
   */
module.exports = {
  getTemplateList: function () {
    return new Promise(function (resolve, reject) {
      request({
        url: `https://api.github.com/users/${organization}/repos`,
        headers: headers
      }, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      })
    })
  },
  getPackage: function (name) {
    return new Promise(function (resolve, reject) {
      request({
        url: `https://raw.githubusercontent.com/TSOHO/template-${name}/master/package.json`,
        headers: headers
      }, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      })
    })
  },
  getReposTree: function (url) {
    return new Promise(function (resolve, reject) {
      request({
        url: url,
        headers: headers
      }, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      })
    })
  },
  getMasterZip: function (name) {
    return request({
      url: `https://www.github.com//TSOHO/template-${name}/archive/master.zip`
    })
  },
  localTemplate: function (name) {
    return path.join(__dirname, '../templates', 'template-' + name + '-master')
  },
  localPackage: function (name) {
    return path.join(__dirname, '../templates', 'template-' + name + '-master/package.json')
  }
}
