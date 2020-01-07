import { h, render } from 'https://unpkg.com/preact@latest?module'
import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(h);

import { App } from './components/App.js'

const app = html`<${App} />`
render(app, document.getElementById('app-root'));


