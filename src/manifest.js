import icon64 from '../media/logo_small'
import icon128 from '../media/logo_small@128'
import icon256 from '../media/logo_small@256'

const isDev = process.env.NODE_ENV !== 'production'

/**
 * @type {WebExtensionManifest}
 */
const config = {
  manifest_version: 2,
  name: 'Dbased - based Dlive',
  version: '1.0',
  description: 'add some cool features to Dlive',
  permissions: [
    'storage',
    "*://graphigo.prd.dlive.tv/*",
  ],
  background: {
    scripts: ['background.js'],
    persistent: false,
  },

  web_accessible_resources: [
    "assets/*",
  ],
  content_scripts: [
    {
      matches: ['https://dlive.tv/*'],
      js: ['content.js'],
      run_at: 'document_start',
    },
  ],
  icons: {
    '64': icon64,
    '128': icon128,
    '256': icon256,
  },

  // options_page: 'options.html',

  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",

  // browser_action: {
  //   default_popup: 'popup.html',
  //   default_icon: icon128,
  // },
}

if (!isDev) {
  // Object.assign(config, {
  //   options_ui: {
  //     page: 'options.html',
  //   },
  // })

  // delete config.options_page
  delete config.key
}

export default config

// stupid hack because when webpack is run with mode: 'production' (or optimization > minimize: true)
// there will be no exports from the required/evaled file
global.__json_output__ = config
