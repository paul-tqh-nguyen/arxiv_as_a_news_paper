import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import {App} from './Components/App';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();
