import { browser } from 'webextension-polyfill-ts'
import Debug from 'debug'

const debug = Debug('ext:background')

browser.runtime.onMessage.addListener(async message => {
  if (message.getIsFollowing) {
    return getUserIsFollowing(message.authToken)
  }
})

async function getUserIsFollowing(authToken: string) {
  const ret = await fetch('https://graphigo.prd.dlive.tv/', {
    credentials: 'include',
    headers: {
      accept: '*/*',
      authorization: authToken,
      'content-type': 'application/json',
      gacid: 'undefined',
      'x-dlive-mtype': 'web',
      'x-dlive-mversion': 'v0.5.26',
    },
    referrer: 'https://dlive.tv/zoomerdev',
    referrerPolicy: 'no-referrer-when-downgrade',
    body:
      '{"operationName":"LivestreamPage","variables":{"displayname":"zoomerdev","add":false,"isLoggedIn":true,"isMe":false,"showUnpicked":false,"order":"PickTime"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"0802b3c202fe9ee4e232284b30ba0609ce6078527943944ddc370be37be8e47b"}}}',
    method: 'POST',
    mode: 'cors',
  })
  const data = (await ret.json()) as typeof userByDisplayName

  return data.data.userByDisplayName.isFollowing
}

const userByDisplayName = {
  data: {
    userByDisplayName: {
      id: 'user:zoomerdev',
      avatar: 'https://images.prd.dlivecdn.com/avatar/8eb9ba9e-455c-11ea-9529-e2443572cd01',
      effect: null,
      __typename: 'User',
      displayname: 'zoomerdev',
      partnerStatus: 'NONE',
      username: 'zoomerdev',
      isFollowing: false,
      isMe: false,
      followers: { totalCount: 0, __typename: 'UserConnection' },
      mySubscription: null,
      canSubscribe: false,
      subSetting: null,
      livestream: null,
      hostingLivestream: null,
      rerun: null,
      offlineImage: 'https://images.prd.dlivecdn.com/offlineimage/video-placeholder.png',
      banStatus: 'NO_BAN',
      deactivated: false,
      myRoomRole: 'Member',
      isSubscribing: false,
      treasureChest: {
        value: '0',
        state: 'COLLECTING',
        ongoingGiveaway: null,
        __typename: 'TreasureChest',
        expireAt: null,
        buffs: [],
        startGiveawayValueThreshold: '500000',
      },
      private: null,
      videos: { totalCount: 0, __typename: 'VideoConnection' },
      pastBroadcasts: { totalCount: 0, __typename: 'PastBroadcastConnection' },
      clips: { totalCount: 0, __typename: 'ClipConnection' },
      following: { totalCount: 0, __typename: 'UserConnection' },
      panels: [],
      beta: { starfruitEnabled: false, __typename: 'Beta' },
    },
  },
}
