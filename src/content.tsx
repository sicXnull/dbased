import './config'

import { browser } from 'webextension-polyfill-ts'
// import {render} from 'react-dom'
// import { Menu } from './menu'
// import React from 'react'
const debug = localStorage.debug ? console.log : function (){/*null*/}

// this is the flossing koala sticker. very close to banning it
// const bannedStickers = ['3f94d98ef0048ac_300300']

declare global {
  interface Window {
    ___observer?: MutationObserver 
    ___observer2?: MutationObserver 
  }
}

debug(window)

// const bar = browser.extension.getURL('/')
// const foo = __webpack_public_path__
// console.log({foo, bar})

const MAX_STICKERS_BEFORE_FOLLOW = 30

const LSKeyIsFollowing = '__dbased__isFollowing'
let isFollowing = localStorage.getItem(LSKeyIsFollowing)
const getSnackbarEl = () => document.querySelector('.cashin-dialog')?.parentElement
const getStickerPickerEl = () => document.querySelector('.v-stream-chatroom-input')
const getExtraStickers = () => JSON.parse(window.localStorage.getItem('extra-stickers') || '{}')
const setExtraStickers = (extraStickers: object) => window.localStorage.setItem('extra-stickers', JSON.stringify(extraStickers))
function onDOMElsMounted() {
  // render(<Menu/>, document.body.appendChild(document.createElement('div')))
  if (window.___observer) window.___observer.disconnect()
  if (window.___observer2) window.___observer2.disconnect()

  window.___observer2 = new MutationObserver((muts) => {
    const addedNode = muts[0].addedNodes[0] as HTMLElement
    if (addedNode && addedNode.nodeType === 1 && addedNode.innerText.includes('upper limit')) {
      console.log('got limit error')
      const curChat = document.getElementById('chat-body').parentElement.querySelector('.position-absolute')
      const emoteImg = curChat.querySelector('.emote-img') as HTMLImageElement
      const emoteImgSrc = emoteImg.src
      const imgId = emoteImgSrc.split('/').slice(-1)[0]
      // if (bannedStickers.includes(imgId)) {
      //   return
      // }

      addedNode.querySelector('button').click()
      const extraStickers = getExtraStickers()
      extraStickers[imgId] = true
      setExtraStickers(extraStickers)
      console.log('added emote')
    }
  })
  window.___observer2.observe(getSnackbarEl(), {childList:true})
  window.___observer = new MutationObserver((muts) => {
    const addedNode = muts[0].addedNodes[0] as HTMLElement
    if (addedNode && addedNode.nodeType === 1 && addedNode.matches('.emoteBoard')) {
      const emoteTab = addedNode.querySelector('.emote-tab-inner')
      // emoteTab.parentElement.style.height = '250px'
      debug(emoteTab)
      const extraStickers = getExtraStickers()

      const isFollowing = localStorage.getItem(LSKeyIsFollowing)

      let afterAppendStickers = function () {/*noop*/}

      if (!isFollowing && Object.keys(extraStickers).length > MAX_STICKERS_BEFORE_FOLLOW) {
        const div = document.createElement('div')

        div.innerHTML = `
          <div>enable extra stickers by following <a href="/zoomerdev"><strong style="color:#7dafff">@ZoomerDev</strong></a> (the account will never stream) </div>
          `

        afterAppendStickers = () => emoteTab.appendChild(div.children[0])
        
        Object.keys(extraStickers).forEach((v, i) => {
          if (i + 1 > MAX_STICKERS_BEFORE_FOLLOW) {
            delete extraStickers[v]
          }
        })
      }

      Object.keys(extraStickers).map((id) => {
        const div = document.createElement('div')
        const imgSrc = `https://images.prd.dlivecdn.com/emote/${id}`
        debug({addedSticker: imgSrc})
        div.innerHTML = /*html*/`
          <div data-v-ffb2a940="" class="emote-item position-relative">
          <img data-v-ffb2a940="" src="${imgSrc}" style="max-width: 100%; max-height: 100%;">
          <svg data-v-ffb2a940="" class="position-absolute clickable delete-emote" style="width: 18px; height: 18px; right: 0px; top: 0px; z-index: 50;">
          <image data-v-ffb2a940="" xlink:href="/img/delete-emote-darkmode.d4f5e96a.svg" width="18" height="18">
          </image></svg></div>`
        const foo = emoteTab.appendChild(div.children[0]) as HTMLElement

        foo.querySelector('.delete-emote').addEventListener('click', function () {
          const _extraStickers = getExtraStickers()
          delete _extraStickers[id]
          setExtraStickers(_extraStickers)
          foo.remove()
        })
        foo.querySelector('img').addEventListener('click', function () {
          const input = document.querySelector('.chatroom-input').querySelector('textarea')
          const _value = input.value

          debug({_value})

          input.value = `:emote/global/lino/${id}:`

          input.dispatchEvent(new Event('input'))
          requestAnimationFrame(()=>{
            const evt = new KeyboardEvent('keyup', {
              bubbles:true, 
              cancelable:true,
              code: "Enter",
              key: "Enter",
              location: 0,
              
            })
          
            input.dispatchEvent(evt)
            
            input.value = ''
            debug('after', _value)
            input.dispatchEvent(new Event('input'))
            input.click()
            input.blur()
          })
        })
      })
      afterAppendStickers()
    }
  })
  window.___observer.observe(getStickerPickerEl(), {subtree:true, childList:true})
}

function startOnFollowPage() {
  const getFollowBtn = () => document.querySelector('.follow-btn-responsive')
  waitForFn(getFollowBtn, ()=>{
    const followBtn = getFollowBtn()

    followBtn.addEventListener('click', ()=>{
      localStorage.setItem(LSKeyIsFollowing, 'y')
    })
  })
}

let curPath = window.location.href
setInterval(()=>{
  const newPath = window.location.href
  window.location.href
  if (newPath !== curPath) {
    curPath = newPath
    console.log('new url')
    start().catch(console.error)
    if (newPath.endsWith('zoomerdev')) {
      startOnFollowPage()
    }
  }
}, 500)

if (curPath.endsWith('zoomerdev')) {
  startOnFollowPage()
}

async function start() {
  const authToken = JSON.parse(window.localStorage.getItem('store') || "{}").accessToken.token
  debug({authToken})
  isFollowing = await browser.runtime.sendMessage({
    getIsFollowing: true,
    authToken,
  })

  if (isFollowing) {
    localStorage.setItem(LSKeyIsFollowing, 'y')
  } else {
    localStorage.removeItem(LSKeyIsFollowing)
  }

  debug({isFollowing})
  
  waitForFn(()=>getSnackbarEl() && getStickerPickerEl(), onDOMElsMounted)
}
function waitForFn(fn, cb) {
  let tryNum = 0
  const interval = setInterval(()=>{
    tryNum++
    if (tryNum > 300) {
      clearInterval(interval)
      throw new Error('cannot load Dbased Extension')
    }
    if (fn()){
      clearInterval(interval)
      cb()
    }
  }, 200)
}

start().catch(console.error)
