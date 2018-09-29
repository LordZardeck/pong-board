import {handleActions} from 'redux-actions';
import {receivePlayersSnapshot} from '../actions/players';

const initialState = {
    registeredPlayers: {}
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
    },
    initialState
);

export default players;

