import { h } from 'https://unpkg.com/preact@latest?module'
import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(h);

export const TranslationPathNode = ({ index, langCode, langLabel, resultText, editMode, options, path, handleDelete, handleAdd, handleSelect}) => {

	function getLangCardText(i) {
		switch(i) {
			case 0: return 'Source language'
			case path.length - 1: return 'Destination language'
			default: return ''
		}
	}

	const isSource = index === 0;
	const isDest = index === path.length - 1;

	const styleClass = `language-card 
		${isSource ? 'language-card__source' : ''} 
		${isDest ? 'language-card__dest' : ''}`

	const buttonsHtml = editMode
		? html`
			<button class="button-link" href="javascript:void(0)" onClick=${() => handleAdd(index)}>Add</a> 
			<button class="button-link" disabled=${isSource || isDest} href="javascript:void(0)" onClick=${() => handleDelete(index)}>Remove</a>
		`
		: '';
	console.log(resultText)
	const resultHtml = resultText
		? html`
			<div class="panel node-panel">
				${resultText}
			</div>
		`
		: '';

	return html`
		<div class=${styleClass}>
			<h6>${getLangCardText(index)}</h6>

			<div class="row">
				<div class=${editMode ? 'twelve columns' : 'six columns'}>
					<select 
						onInput=${e => handleSelect(e.target.value, index)} 
						value=${langCode} 
						placeholder="Select one baby"
						disabled=${!editMode}
					>
						${options}
					</select>
					${buttonsHtml}
				</div>

				<div class="six columns">
					${resultHtml}
				</div>
			</div>
		</div>
	`;
}

export const TranslationPath = ({ langData, path, setPath, results, editMode }) => {

	function handleSelect(newLangCode, i) {
		let newPath = [ ...path];
		newPath[i] = newLangCode
		setPath(newPath);
	}

	function handleAdd(i) {
		let newPath = [ ...path];
		newPath.splice(i + 1, 0, '');
		setPath(newPath);
	}

	function handleDelete(i) {
		let newPath = [ ...path];
		newPath.splice(i, 1);
		setPath(newPath);
	}

	function getLangLabel(lang) {
		return langData.langs[lang];
	}

	function getOptions(sourceLang) {
		return langData.langsInOrder.map(lang => {
			return html`
				<option key=${lang.key} value=${lang.key}>${lang.label}</option>
			`;
		})
	}

	return path.map((langCode, i) => {
		return html`
			<${TranslationPathNode}
				index=${i}
				langCode=${langCode}
				langLabel=${getLangLabel(langCode)}
				options=${getOptions()}
				resultText=${results[i]}
				handleAdd=${handleAdd}
				handleDelete=${handleDelete}
				handleSelect=${handleSelect}
				editMode=${editMode}
				path=${path}
			/>
		`;
	})
}