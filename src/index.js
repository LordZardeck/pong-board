import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// database.collection('players').get().then(snapshot => snapshot.forEach(player => console.log(player.data())));

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
