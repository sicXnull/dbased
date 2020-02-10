const showdown = require('showdown')
const fs = require('fs-extra')
const _ = require('lodash')
const path = require('path')
const root = path.join(__dirname, '..')
let config = _.defaults(require('./pages.config'), {
  outputPath:  '../index.html',
  readmePath: '../README.md',
  templatePath: './template.html',
  meta: {},
})
;(async function () {
  config = _.mapValues(config, (val, key) => {
    if (key.endsWith('Path')) {
      return path.relative(root, path.join(__dirname, val))
    }
    return val
  })
  const converter = new showdown.Converter()
  if (!config.meta.image && config.imagePath) {
    config.meta.image = config.meta.url + '/' + config.imagePath
  }
  const metas = {
    "twitter:image:src": config.meta.image,
    "twitter:site":config.meta.twitterHandle,
    "twitter:card": "summary_large_image",
    "twitter:title": config.title,
    "twitter:description": config.meta.description,
    "og:image": config.meta.image,
    "og:site_name": config.title,
    "og:type": 'object',
    "og:title": config.title,
    "og:url": config.meta.url,
    "og:description": config.meta.description,
  }
  const metaOpenGraph = _.map(metas, (val, key) => {
    if (!val) return ''
    return `<meta name="${key}" content="${val}">`
  }).reduce((a, b) => a+b, '')
  converter.setFlavor('github')
  const [markdownText, templateHTML] = await Promise.all([
    readText(config.readmePath),
    readText(config.templatePath),
  ])
  const resultHTML = converter.makeHtml(markdownText.replace(/## Contributing[\n\S\s]*?((\n## )|$)/s, "$2"))
  const compile = _.template(templateHTML)
  const compiledHTML = compile({body: resultHTML, metaOpenGraph, ...config})
  await fs.writeFile(config.outputPath, compiledHTML)
})().then(console.log).catch(console.error)

async function readText (path) {
  return (await fs.readFile(path)).toString()
}
