import {createActions} from 'redux-actions';
import firebase from '../../firebase';

export const {receivePlayersSnapshot} = createActions('RECEIVE_PLAYERS_SNAPSHOT');

let unregisterCollectionObserver = null;

export function subscribePlayersSnapshot() {
    return dispatch => {
        if (unregisterCollectionObserver !== null) {
            unregisterCollectionObserver();
            unregisterCollectionObserver = null;
        }

        unregisterCollectionObserver = firebase.firestore().collection('players').onSnapshot(snapshot => dispatch(receivePlayersSnapshot(snapshot.docs)));
    };
}

