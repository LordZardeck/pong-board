import {handleActions} from 'redux-actions';
import {
    receiveMatchesSnapshot,
    resetMatch,
    selectLeftPlayer,
    selectRightPlayer,
    updateLeftScore,
    updateRightScore,
    togglePlayerSelector
} from '../actions/matches';

const initialState = {
    leftScore: 0,
    rightScore: 0,
    leftPlayer: null,
    rightPlayer: null,
    latestMatches: {},
    showPlayerSelector: false
};

const screens = handleActions(
    {
        [selectLeftPlayer]: (state, {payload}) => ({
            ...state,
            leftPlayer: payload
        }),
        [selectRightPlayer]: (state, {payload}) => ({
            ...state,
            rightPlayer: payload
        }),
        [resetMatch]: state => ({
            ...initialState,
            latestMatches: state.latestMatches
        }),
        [updateLeftScore]: (state, {payload}) => ({
            ...state,
            leftScore: payload
        }),
        [updateRightScore]: (state, {payload}) => ({
            ...state,
            rightScore: payload
        }),
        [receiveMatchesSnapshot]: (state, {payload}) => ({
            ...state,
            latestMatches: payload
        }),
        [togglePlayerSelector]: (state, {payload}) => ({
            ...state,
            showPlayerSelector: payload
        })
    },
    initialState
);

export default screens;

