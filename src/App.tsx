import React, {MouseEventHandler, useState} from 'react'
import $ from 'jquery'
import {pipe} from "fp-ts/function"
import {map} from "fp-ts/lib/Array"
import {FItem, FMedia, FResponse} from "./flickr-types"

const host = 'api.flickr.com'
const uriPath = '/services/feeds/photos_public.gne'
const queryParams = (t: string) => `?tags=${t}&format=json&jsoncallback=?`
const requestUri = (t: string) => `https://${host}${uriPath}${queryParams(t)}`
const prop = <T, K extends keyof T>(key: K) => (obj: T): T[K] => obj[key]

const mediaUrl = (r: FItem) => pipe(r, prop<FItem, 'media'>('media'), prop<FMedia, 'm'>('m'))
const mediaUrls = (r: FResponse) => pipe(r, prop<FResponse, 'items'>('items'), map(mediaUrl))

// Impure!
const getJson = (callback: (r: FResponse) => void) => (url: string) => $.getJSON(url, callback)

// Impure!
const trace: (t: string) => <T>(value: T) => T = t => value => {
  console.log(t, value);
  return value
}

const responseCallback = (f: (urls: Array<string>) => void) => (resp: FResponse) => pipe(
  resp,
  trace('response'),
  mediaUrls,
  f
)

function App() {

  const [searchWord, setSearchWord] = useState('')
  const [imageUrls, setImageUrls] = useState<Array<string>>([])

  const handleSearchClick: MouseEventHandler<HTMLElement> = e => {
    e.preventDefault()
    pipe(
      searchWord,
      requestUri,
      getJson(responseCallback(setImageUrls))
    )
  }

  return (
    <div>
      <p>Enter a word:</p>
      <input type="text" onChange={e => setSearchWord(e.target.value)} />
      <input type="button" onClick={handleSearchClick} value="Find" />
      <div>
        {imageUrls.map(v => (
          <img src={v} alt={v} />
        ))}
      </div>
    </div>
  )

}

export default App
