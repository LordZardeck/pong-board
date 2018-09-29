import {handleActions} from 'redux-actions';
import {changeScreen, Screens} from '../actions/screens';

const initialState = {
    currentScreen: Screens.RecordMatch
};

const screens = handleActions(
    {
        [changeScreen]: (state, {payload}) => ({
            ...state,
            currentScreen: payload
        }),
    },
    initialState
);

export default screens;

