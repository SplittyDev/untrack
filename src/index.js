import './style'
import { Component } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import Untrack from './untrack'

export default class App extends Component {
  render () {
    return (
      <main>
        <Header />
        <SearchBar />
        <Footer />
      </main>
    )
  }
}

const Header = () => (
  <header>
    <h1>untrack</h1>
    <span>Get rid of tracking parameters.</span>
  </header>
)

const Footer = () => (
  <footer>
    <span>
      We do not store any cookies or other data.
      <br />
      URL processing is done on your device.
      <br />
      <div class='small'>
        <a href='https://github.com/splittydev/untrack'>Fork me on GitHub</a>
        &nbsp;|&nbsp;
        <a href="javascript:window.location='https://untrack.de/#'+window.location.href">Bookmark</a>
      </div>
    </span>
  </footer>
)

const SearchBar = () => {
  const [url, setUrl] = useState('')
  const [cleanUrl, setCleanUrl] = useState('')
  const [conversionDone, setConversionDone] = useState(false)

  useEffect(() => {
    const defaultState = window.location.hash ? window.location.hash.substring(1) : null
    if (defaultState !== null) {
      setUrl(defaultState)
      setCleanUrl(new Untrack(defaultState).process())
      setConversionDone(true)
    }
  })

  return (
    <div class='searchBar'>
      <input
        class='input--url' value={url} onInput={(e) => {
          setUrl(e.target.value)
          setCleanUrl(new Untrack(e.target.value).process())
          setConversionDone(true)
        }} type='text'
      />
      {url.trim().length > 0 && conversionDone && (
        <span class='result'>
          Cleaned up URL:
          <br />
          <a href={cleanUrl}>{cleanUrl}</a>
        </span>
      )}
    </div>
  )
}
