const pluginName = 'JsonOutputPlugin'

module.exports = class JsonOutputPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    const self = this

    /**
     * Hook into the webpack emit phase
     * @param {WebpackCompilation} compilation
     * @param {() => void} callback
    */
    compiler.hooks.emit.tapAsync(pluginName,
      (compilation, callback) => {
        // Get all entry point names for self html file

        const assetFilename = `${self.options.asset}.js`
        
        let json

        const asset = compilation.assets[assetFilename]
        delete compilation.assets[assetFilename]

        try {
          let evaledFile = eval(asset.source())
          if (typeof (evaledFile) === 'boolean') {
            evaledFile = global.__json_output__
          } else if (evaledFile && (typeof evaledFile.default === 'object')) {
            evaledFile = evaledFile.default
          }

          json = JSON.stringify(evaledFile, null, 2)
        } catch (e) {
          compilation.errors.push(`${pluginName}: ${e.message}\n${e.stack}`)
          callback(null)
          return
        } 

        if (self.previousJson === json) {
          return callback(null)
        }
    
        compilation.assets[self.options.filename] = {
          source: () => json,
          size: () => json.length,
        }
    
        self.previousJson = json
    
        callback(null)
      },
    )
  }
}
