import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css'
import * as serviceWorker from './serviceWorker';
import {HeaderRow} from './Components/HeaderRow/HeaderRow';

ReactDOM.render(<HeaderRow />, document.getElementById('root'));
serviceWorker.register();
