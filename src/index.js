import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './redux/reducers';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusCircle);
library.add(faSearch);

ReactDOM.render(
    <Provider store={createStore(reducers, applyMiddleware(thunk))}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
