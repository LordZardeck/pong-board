import {handleActions} from 'redux-actions';
import {changeAuth, updateTeam} from '../actions/auth';

const initialState = {
    user: null,
    hasInitialized: false
};

const screens = handleActions(
    {
        [changeAuth]: (state, {payload}) => ({
            ...state,
            user: payload,
            hasInitialized: true
        }),
        [updateTeam]: (state, {payload}) => ({
            ...state,
            user: {
                ...state.user,
                teams: [
                    ...state.user.teams.filter(team => team.teamId !== payload.teamId),
                    payload
                ]
            }
        })
    },
    initialState
);

export default screens;

