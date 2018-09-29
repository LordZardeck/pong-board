import {createActions} from 'redux-actions';
import firebase from '../../firebase';

export const {receivePlayersSnapshot, receiveConsecutiveWinsSnapshot, receiveConsecutiveLossesSnapshot} =
    createActions('RECEIVE_PLAYERS_SNAPSHOT', 'RECEIVE_CONSECUTIVE_WINS_SNAPSHOT', 'RECEIVE_CONSECUTIVE_LOSSES_SNAPSHOT');

let unregisterAllPlayersCollectionObserver = null;
let unregisterConsecutiveWinsCollectionObserver = null;
let unregisterConsecutiveLossesCollectionObserver = null;

export function subscribeConsecutiveWins() {
    return dispatch => {
        if (unregisterConsecutiveWinsCollectionObserver !== null) {
            unregisterConsecutiveWinsCollectionObserver();
            unregisterConsecutiveWinsCollectionObserver = null;
        }

        unregisterConsecutiveWinsCollectionObserver =
            firebase.firestore().collection('players').orderBy('consecutiveWins', 'desc').limit(1).onSnapshot(snapshot => {
                const player = snapshot.docs.pop();

                dispatch(receiveConsecutiveWinsSnapshot(player ? player.id : null));
            });
    };
}

export function subscribeConsecutiveLosses() {
    return dispatch => {
        if (unregisterConsecutiveLossesCollectionObserver !== null) {
            unregisterConsecutiveLossesCollectionObserver();
            unregisterConsecutiveLossesCollectionObserver = null;
        }

        unregisterConsecutiveLossesCollectionObserver =
            firebase.firestore().collection('players').orderBy('consecutiveLosses', 'desc').limit(1).onSnapshot(snapshot => {
                const player = snapshot.docs.pop();

                dispatch(receiveConsecutiveLossesSnapshot(player ? player.id : null));
            });
    };
}


export function subscribePlayersSnapshot() {
    return dispatch => {
        if (unregisterAllPlayersCollectionObserver !== null) {
            unregisterAllPlayersCollectionObserver();
            unregisterAllPlayersCollectionObserver = null;
        }

        unregisterAllPlayersCollectionObserver = firebase.firestore().collection('players').onSnapshot(snapshot => dispatch(receivePlayersSnapshot(snapshot.docs)));
    };
}

