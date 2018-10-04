import {createActions} from 'redux-actions';
import firebase from "../../firebase";
import Elo from "arpad";

export const {selectLeftPlayer, selectRightPlayer, resetMatch, updateLeftScore, updateRightScore, receiveMatchesSnapshot, togglePlayerSelector} =
    createActions(
        'SELECT_LEFT_PLAYER',
        'SELECT_RIGHT_PLAYER',
        'RESET_MATCH',
        'UPDATE_LEFT_SCORE',
        'UPDATE_RIGHT_SCORE',
        'RECEIVE_MATCHES_SNAPSHOT',
        'TOGGLE_PLAYER_SELECTOR'
    );

let unregisterCollectionObserver = null;

export function scoreLeft(points) {
    points = parseInt(points);

    return updateLeftScore(isNaN(points) ? 0 : points);
}

export function scoreRight(points) {
    points = parseInt(points);

    return updateRightScore(isNaN(points) ? 0 : points);
}

export function subscribeMatchesSnapshot() {
    return dispatch => {
        if (unregisterCollectionObserver !== null) {
            unregisterCollectionObserver();
            unregisterCollectionObserver = null;
        }

        unregisterCollectionObserver = firebase.firestore().collection('matches').orderBy('timestamp', 'desc').limit(20).onSnapshot(snapshot => {
            const activityCollection = {};

            snapshot.docs.forEach((matchSnapshot) => {
                activityCollection[matchSnapshot.id] = matchSnapshot.data();
                activityCollection[matchSnapshot.id].winner = activityCollection[matchSnapshot.id].winner.id;
                activityCollection[matchSnapshot.id].loser = activityCollection[matchSnapshot.id].loser.id;
            });

            dispatch(receiveMatchesSnapshot(activityCollection));
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
