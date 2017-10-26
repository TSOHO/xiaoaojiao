const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const ora = require('ora')
const Client = require('ftp')
const ProgressBar = require('progress')
const Table = require('cli-table')

const util = require('../util/util')

const spinner = ora('loading……')

class Ftp {
  constructor (config) {
    this.init(config)
  }
  init (config) {
    const base = this

    base.config = config
    base.abslocal = path.join(process.cwd(), base.config.local)
    base.client = new Client(config.ftp)
    base.files = util.getFilesList(base.abslocal)
    base.fileslen = base.files.length

    const columns = process.stderr.columns
    const colWidths = [
      Math.floor(columns * 0.5),
      Math.floor(columns * 0.16),
      Math.floor(columns * 0.16)
    ]

    base.table = new Table({
      chars: {
        'top': '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        'bottom': '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        'left': '',
        'left-mid': '',
        'mid': '',
        'mid-mid': '',
        'right': '',
        'right-mid': '',
        'middle': ' '
      },
      colWidths: colWidths,
      style: {
        'padding-left': 0,
        'padding-top': 0,
        'padding-bottom': 0,
        'padding-right': 0
      }
    })
  }

  /**
   * 连接ftp
   *
   *
   * @memberOf Ftp
   */
  connect () {
    const base = this

    console.log('')
    console.log(chalk.blue('> 开始连接', base.config.ftp.host, 'port:', base.config.ftp.port))
    base.client.connect(base.config.ftp)
    spinner.start()

    base.ready().then(base.upload.bind(base))
  }

  ready () {
    const base = this

    return new Promise(function (resolve, reject) {
      base.client.on('ready', function () {
        spinner.stop()
        console.log(chalk.blue('> 连接成功'))
        resolve()
      })
    })
  }

  upload () {
    const base = this

    console.log(chalk.blue('> 开始上传'))

    base.startTime = +new Date()

    console.log('')
    base.mkdir(base.files)
  }

  mkdir (files) {
    const base = this
    const remotepath = base.remotepath(files[0])

    base.client.mkdir(path.dirname(remotepath), true, function (err) {
      if (err) {
        return console.log(err)
      }

      base.puts(base.files[0])
    })
  }

  puts (file) {
    const base = this
    const rs = fs.createReadStream(file)

    const bar = new ProgressBar(file.replace(base.abslocal, '') + ' [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      total: fs.statSync(file).size,
      clear: true
    })

    rs.on('data', function (chunk) {
      bar.tick(chunk.length)
    })

    rs.on('end', function () {
      bar.terminate()
    })

    const remotepath = base.remotepath(file)
    const size = fs.statSync(file).size
    const sizekb = util.formatSize(size)

    base.client.put(rs, remotepath, function (err) {
      if (err) {
        base.tableLog([
          chalk.red('>', remotepath),
          chalk.red(`${sizekb}`),
          chalk.red('×')
        ])
      }

      base.tableLog([
        chalk.green('>', remotepath),
        chalk.green(`${sizekb}`),
        chalk.green('︎✔')
      ])

      base.files.shift()

      if (base.files.length < 1) {
        return base.end()
      }

      base.mkdir(base.files)
    })
  }

  tableLog (arr) {
    const base = this

    if (base.table.length > 0) {
      base.table.pop()
    }
    base.table.push(arr)
    console.log(base.table.toString(arr))
  }

  end () {
    const base = this
    let time = +new Date() - base.startTime

    console.log('')
    console.log(chalk.blue(`> 共上传文件: ${base.fileslen}个    用时: ${time / 1000}s`))
    base.client.end()
  }

  remotepath (file) {
    return file.replace(this.abslocal, this.config.remote).replace(/\/\//g, '/')
  }
}

module.exports = Ftp
