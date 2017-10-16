const Axios = require('axios')

const organization = 'TSOHO'
  /**
   * 获取organization所有模板
   */
module.exports = {
  getTemplateList: () => {
    return Axios.get(`https://api.github.com/users/${organization}/repos`)
  },
  getPackage: (name) => {
    return Axios.get(`https://raw.githubusercontent.com/TSOHO/template-${name}/master/package.json`)
  }
}
