const Axios = require('axios')

const path = require('path')

const organization = 'TSOHO'
  /**
   * 获取organization所有模板
   */
module.exports = {
  getTemplateList: function () {
    return Axios.get(`https://api.github.com/users/${organization}/repos`)
  },
  getPackage: function (name) {
    return Axios.get(`https://raw.githubusercontent.com/TSOHO/template-${name}/master/package.json`)
  },
  localTemplate: function (name) {
    return path.join(__dirname, '../template', 'template-' + name + '-master')
  },
  localPackage: function (name) {
    return path.join(__dirname, '../template', 'template-' + name + '-master/package.json')
  }
}
