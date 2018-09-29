import {createActions} from 'redux-actions';

export const {changeScreen} = createActions('CHANGE_SCREEN');
export const Screens = {
    LeaderBoards: 'leader-boards',
    RecordMatch: 'record-match'
};

