import {createActions} from 'redux-actions';
import firebase from "../../firebase";
import Elo from "arpad";

export const {selectLeftPlayer, selectRightPlayer, resetMatch, updateLeftScore, updateRightScore, receiveMatchesSnapshot} =
    createActions(
        'SELECT_LEFT_PLAYER',
        'SELECT_RIGHT_PLAYER',
        'RESET_MATCH',
        'UPDATE_LEFT_SCORE',
        'UPDATE_RIGHT_SCORE',
        'RECEIVE_MATCHES_SNAPSHOT'
    );

let unregisterCollectionObserver = null;

export function subscribeMatchesSnapshot() {
    return dispatch => {
        if (unregisterCollectionObserver !== null) {
            unregisterCollectionObserver();
            unregisterCollectionObserver = null;
        }

        unregisterCollectionObserver = firebase.firestore().collection('matches').orderBy('timestamp', 'desc').limit(20).onSnapshot(snapshot => {
            const activityCollection = {};

            Promise.all(snapshot.docs.map((matchSnapshot) => {
                activityCollection[matchSnapshot.id] = matchSnapshot.data();

                const winnerUpdate = activityCollection[matchSnapshot.id].winner.get()
                    .then(winner => activityCollection[matchSnapshot.id].winner = winner.data());
                const loserUpdate = activityCollection[matchSnapshot.id].loser.get()
                    .then(loser => activityCollection[matchSnapshot.id].loser = loser.data());

                return Promise.all([winnerUpdate, loserUpdate]);
            })).then(() => dispatch(receiveMatchesSnapshot(activityCollection)));
        });
    };
}

export function completeMatch() {
    return (dispatch, getState) => {
        const state = getState();
        const leftPlayerId = state.matches.leftPlayer,
            rightPlayerId = state.matches.rightPlayer;

        const playerData = {
            [leftPlayerId]: state.players.registeredPlayers[leftPlayerId],
            [rightPlayerId]: state.players.registeredPlayers[rightPlayerId]
        };

        if (leftPlayerId === null || rightPlayerId === null || leftPlayerId === rightPlayerId) {
            return;
        }

        const matchResult = {
            winningScore: Math.max(state.matches.leftScore, state.matches.rightScore),
            losingScore: Math.min(state.matches.leftScore, state.matches.rightScore),
            timestamp: Date.now()
        };

        const winnerId = matchResult.winningScore === parseInt(state.matches.leftScore) ? leftPlayerId : rightPlayerId;
        const loserId = matchResult.losingScore === parseInt(state.matches.leftScore) ? leftPlayerId : rightPlayerId;

        const winnerDocRef = firebase.firestore().collection('players').doc(winnerId);
        const loserDocRef = firebase.firestore().collection('players').doc(loserId);

        firebase.firestore()
            .runTransaction(
                transaction => {
                    const elo = new Elo(),
                        winnerScore = playerData[winnerId].score,
                        loserScore = playerData[loserId].score;

                    transaction.update(winnerDocRef,
                        {
                            score: elo.newRatingIfWon(winnerScore, loserScore),
                            wins: playerData[winnerId].wins + 1,
                            consecutiveWins: playerData[winnerId].consecutiveWins + 1,
                            consecutiveLosses: 0
                        });
                    transaction.update(loserDocRef,
                        {
                            score: elo.newRatingIfLost(loserScore, winnerScore),
                            losses: playerData[loserId].losses + 1,
                            consecutiveWins: 0,
                            consecutiveLosses: playerData[loserId].consecutiveLosses + 1
                        });

                    return Promise.resolve();
                }
            );

        matchResult.winner = firebase.firestore().doc(`/players/${winnerId}`);
        matchResult.loser = firebase.firestore().doc(`/players/${loserId}`);

        firebase.firestore().collection('matches').add(matchResult);

        dispatch(resetMatch());
    };
}
