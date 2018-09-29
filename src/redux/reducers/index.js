import { combineReducers } from 'redux';
import screens from './screens';
import players from './players';
import matches from './matches';

export default combineReducers({ screens, players, matches });
