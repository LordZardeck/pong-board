import {handleActions} from 'redux-actions';
import {
    receiveConsecutiveLossesSnapshot,
    receiveConsecutiveWinsSnapshot,
    receivePlayersSnapshot
} from '../actions/players';

const initialState = {
    registeredPlayers: {},
    bestWinningStreak: null,
    mostConsecutiveLosses: null
};

const players = handleActions(
    {
        [receivePlayersSnapshot]: (state, {payload}) => {
            const registeredPlayers = {};

            payload.forEach(playerSnapshot => {
                registeredPlayers[playerSnapshot.id] = playerSnapshot.data();
            });

            return ({
                ...state,
                registeredPlayers
            });
        },
        [receiveConsecutiveWinsSnapshot]: (state, {payload}) => ({
            ...state,
            bestWinningStreak: payload
        }),
        [receiveConsecutiveLossesSnapshot]: (state, {payload}) => ({
            ...state,
            mostConsecutiveLosses: payload
        })
    },
    initialState
);

export default players;

