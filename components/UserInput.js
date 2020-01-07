import { h, render } from 'https://unpkg.com/preact@latest?module'
import { useState } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import htm from 'https://unpkg.com/htm?module';
import { TranslationPath } from './TranslationPath.js'
const html = htm.bind(h);

export const UserInput = ({ userInput, setUserInput, langData, results, editMode, isTranslating, translate, doAnotherOne, cancel }) => {

	function setPath(newPath) {
		setUserInput({ ...userInput, translationPath: newPath })
	}

	function renderNumberInput() {
		return userInput.isRandom ? html`
			<div class="row">
				<div class="six columns">
					<label>Number of translations</label>
					<input 
						type="number"
						class="u-full-width"
						value=${userInput.translationCount}
						onInput=${e => setUserInput({ ...userInput, translationCount: e.target.value })}
						min="2"
						max="10"
					/>
				</div>
			</div>
		` : ''
	}

	function renderPath() {
		return userInput.isRandom 
		? '' 
		: html`<${TranslationPath} langData=${langData} path=${userInput.translationPath} setPath=${setPath} results=${results} editMode=${editMode} />`
	}

	function renderButtons() {
		if (isTranslating) {
			return html`
				<input class="" type="submit" value="Cancel" onClick=${() => cancel()} />
			`
		} else if (editMode) {
			return html`
				<input class="button-primary" type="submit" value="Start translation" onClick=${() => translate()} />
			`
		} else {
			return html`
				<input class="button-primary" type="submit" value="Try another translation" onClick=${() => doAnotherOne()} />
			`
		}
	}

	return html`
		<div class="user-input">
			<br/>
			<div class="row">
				<label for="initialText">Text to translate</label>
				<textarea 
					id="initialText"
					value=${userInput.initialText} 
					onInput=${e => setUserInput({ ...userInput, initialText: e.target.value })} 
					class="u-full-width"
					disabled=${!editMode}
					onFocus=${e => { e.target.focus(); e.target.select()}}
				></textarea>
			</div>

			<!-- <div class="row">
				<div class="six columns">
					<label>
						<input 
							type="checkbox" 
							checked=${userInput.isRandom} 
							onClick=${e => setUserInput({ ...userInput, isRandom: !userInput.isRandom })}
						/>
						<span class="label-body"> Randomize languages</span>
					</label>
				</div>
			</div> -->

			${renderNumberInput()}
			${renderPath()}
			<br />
			${renderButtons()}

			
</div>
	`;
}