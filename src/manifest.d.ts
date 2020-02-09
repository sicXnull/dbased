type pathString = string
type patternString = string
interface WebExtensionManifest {
  author: string
  background: ( {scripts: pathString[]} | {page: pathString}) & {
    persistent: boolean
  }
  content_scripts: {
    matches: string
    all_frames?: boolean
    css?: pathString[]
    js?: pathString[]
    run_at?: 'document_start' | 'document_end' | 'document_idle'
    match_about_blank?: boolean
    exclude_globs?: string[]
    include_globs?: string[]
    exclude_matches?: string[]
  }[]

  options_ui: {
    browser_style?: boolean
    open_in_tab: boolean
    page: pathString
  }
  
  web_accessible_resources: pathString[]
  permissions: permissions[]

}

type permissions =
'activeTab' |
'alarms' |
'background' |
'bookmarks' |
'browserSettings' |
'browsingData' |
'captivePortal' |
'clipboardRead' |
'clipboardWrite' |
'contentSettings' |
'contextMenus' |
'contextualIdentities' |
'cookies' |
'debugger' |
'dns' |
'downloads' |
'downloads.open' |
'find' |
'geolocation' |
'history' |
'identity' |
'idle' |
'management' |
'menus' |
'menus.overrideContext' |
'nativeMessaging' |
'notifications' |
'pageCapture' |
'pkcs11' |
'privacy' |
'proxy' |
'search' |
'sessions' |
'storage' |
'tabHide' |
'tabs' |
'theme' |
'topSites' |
'unlimitedStorage' |
'webNavigation' |
'webRequest' |
'webRequestBlocking' | patternString
