import './style'
import { Component } from 'preact'
import { useState } from 'preact/hooks'
import Untrack from './untrack'

export default class App extends Component {
	render() {
		return (
			<main>
				<Header/>
				<SearchBar/>
				<Footer/>
			</main>
		);
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
		<span>We do not store any cookies or other data.<br/>URL processing is done on your device.</span>
	</footer>
)

const SearchBar = () => {
	const [url, setUrl] = useState('')
	const [cleanUrl, setCleanUrl] = useState('')
	const [conversionDone, setConversionDone] = useState(false)
	return (
		<div class="searchBar">
			<input class="input--url" value={url} onInput={(e) => {
				setUrl(e.target.value)
				setCleanUrl(new Untrack(e.target.value).process())
				setConversionDone(true)
			}} type="text"/>
			{ url.trim().length > 0 && conversionDone && (
				<span class="result">
					Cleaned up URL:
					<br/>
					<a href={cleanUrl}>{cleanUrl}</a>
				</span>
			)}
		</div>
	)
}