const showdown = require('showdown')
const fs = require('fs-extra')
const _ = require('lodash')
const path = require('path')
const root = path.join(__dirname, '..')
let config = _.defaults(require('./pages.config'), {
  outputPath:  '../index.html',
  readmePath: '../README.md',
  templatePath: './template.html',
})
;(async function () {
  config = _.mapValues(config, (val, key) => {
    if (key.endsWith('Path')) {
      return path.relative(root, path.join(__dirname, val))
    }
    return val
  })
  const converter = new showdown.Converter()
  converter.setFlavor('github')
  const [markdownText, templateHTML] = await Promise.all([
    readText(config.readmePath),
    readText(config.templatePath),
  ])
  const resultHTML = converter.makeHtml(markdownText.replace(/## Contributing[\n\S\s]*?((\n## )|$)/s, "$2"))
  const compile = _.template(templateHTML)
  const compiledHTML = compile({body: resultHTML, ...config})
  await fs.writeFile(config.outputPath, compiledHTML)
})().then(console.log).catch(console.error)

async function readText (path) {
  return (await fs.readFile(path)).toString()
}
