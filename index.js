const readdir = require('recursive-readdir')

class Builder {
  constructor () {
    this.settings = {
      path: './',
      exclude: [],//globs
      files: true,
      directories: true,
      newerThan: 0,
      logging: true
    }
  }

  /**
   * Set source path
   * @param {String} dir
   * @return {Builder}
   */
  path (dir = './') {
    this.settings.path = dir
    return this
  }

  /**
   * Exclude directories
   * @param {Array} dirList
   * @return {Builder}
   */
  exclude (dirList = []) {
    this.settings.exclude = this.settings.exclude.concat(dirList)
    return this
  }

  /**
   * Sets whether to include files
   * @param {Boolean} bool
   * @return {Builder}
   */
  files (bool = false) {
    this.files = bool
    return this
  }

  /**
   * Sets whether to include directories
   * @param {Boolean} bool
   * @return {Builder}
   */
  directories (bool = false) {
    this.directories = bool
    return this
  }

  /**
   * Sets newer than setting
   * @param {Date} datetime
   * @return {Builder}
   */
  newerThan (datetime) {
    this.settings.newerThan = Number(datetime)
    return this
  }

/**
   * Sets whether to output logs.
   * If not set, uses true.
   * @param {Boolean} bool
   * @return {Builder}
   */
  logging (bool = false) {
    this.settings.logging = bool
    return this
  }

  /**
   * Executes the scan
   * @return {Promise} Resolves list of files
   */
  exec () {
    if(this.settings.logging){
        console.log('exec', 'Settings: newerThan is stored in milliseconds', {
          'settings': this.settings
        })
    }
    return readdir(this.settings.path, [...this.settings.exclude, this._oldExcluder.bind(this)])
  }

  /**
  * @see https://github.com/jergason/recursive-readdir/issues/61
  * @param {File} file
  * @param {object} stats
  * @return {boolean}
   */
  _oldExcluder (file, stats) {
    if(this.settings.logging){
        console.log('File', file, stats)
    }
    if (stats.isFile() && !this.settings.files) {
      if(this.settings.logging){
          console.log('file not allowed')
      }
      return true
    }
    if (stats.isDirectory() && !this.settings.directories) {
        if(this.settings.logging){
            console.log('directory not allowed')
        }
      return true
    }
    if (stats.mtimeMs < this.settings.newerThan) {
        if(this.settings.logging){
            console.log('file modify date too new')
        }
      return true
    }

    if(this.settings.logging) {
      console.log('file not excluded')
    }
    return false
  }
}

class NodeRecentlyModified {
  static builder () {
    return new Builder()
  }
}

module.exports = NodeRecentlyModified
