import { h } from 'https://unpkg.com/preact@latest?module'
import { useState, useEffect, useRef } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import htm from 'https://unpkg.com/htm?module';
import { UserInput } from './UserInput.js'
import { API_KEY } from '../keys.js'

const html = htm.bind(h);

async function getLangData() {
	// const langData = await fetch('/getLangs').then(res => res.json())
	const langData = await fetch(
		`https://translate.yandex.net/api/v1.5/tr.json/getLangs` +
		`?key=${API_KEY}` +
		`&ui=en`
	).then(res => res.json())
	console.log(langData);
	return langData
}

async function translateText(text, destLang) {
	return fetch(
		'https://translate.yandex.net/api/v1.5/tr.json/translate' +
		'?key=' + API_KEY +
		'&text=' + encodeURI(text) +
		'&lang=' + destLang
	)
	.then(result => result.json())
	.catch(error => {
		console.error(error);
		return null;
	})
}

export const App = () => {
	const [isTranslating, setIsTranslating] = useState(false);
	const [editMode, setEditMode] = useState(true);
	const [results, setResults] = useState([]);
	const [ langData, setLangData ] = useState();
	const cancelPressedRef = useRef(false);
	const [userInput, setUserInput] = useState({
		initialText: 'hello',
		isRandom: false,
		translationCount: 2,
		whitelistedLangs: [],
		translationPath: ['en', 'de', 'en']
	});

	async function translate() {
		setIsTranslating(true);
		setEditMode(false);

		// Remove blank languages
		const newUserInput = {
			...userInput,
			translationPath: userInput.translationPath.filter(lang => lang)
		}
		const { initialText, translationPath } = newUserInput
		setUserInput(newUserInput)

		let text = initialText;
		let index = 1;
		let resultsRef = [text];
		setResults(resultsRef);
		while (index < translationPath.length) {
			const res = await translateText(text, translationPath[index])
			if (cancelPressedRef.current) {
				cancelPressedRef.current = false;
				setIsTranslating(false);
				setEditMode(true);
				setResults([]);
				return;
			}
			if (res) {
				text = res.text;
				resultsRef = [ ...resultsRef, text];
				setResults(resultsRef);
				index++;
			}	
		}
		setIsTranslating(false);
	}

	function doAnotherOne() {
		setEditMode(true);
		setResults([]);
	}

	function cancel() {
		cancelPressedRef.current = true;
	}

	function copy() {
		document.querySelector('.result-panel').select();
		document.execCommand("copy");
	}

	useEffect(async () => {
		const returnedLangData = await getLangData();
		returnedLangData.langsInOrder = Object.entries(returnedLangData.langs)
			.map(([key, value]) => ({
				key, 
				label: value
			}))
			.sort((a, b) => a.label > b.label ? 1 : -1)
		setLangData(returnedLangData);
	}, [])

	return langData ? html`
		<div class="app container">
			<div class="row">
				<${UserInput} 
					userInput=${userInput} 
					setUserInput=${setUserInput}
					translate=${translate} 
					langData=${langData}
					results=${results}
					editMode=${editMode}
					isTranslating=${isTranslating}
					doAnotherOne=${doAnotherOne}
					cancel=${cancel}
				/>
			</div>
			<br/>
			${
				results[userInput.translationPath.length - 1]
				? html`
					<label>Result <button class="button-link copy-link" onClick=${copy}>Click to copy</button></label>
					<textarea readonly class="panel result-panel u-full-width">
						${results[userInput.translationPath.length - 1]}
					</textarea>
				`
				: ''
			}
			
			<a href="http://translate.yandex.com">Powered by Yandex.Translate</a>
		</div>
	` : 'If the page is taking a while to reload, try refreshing';
}