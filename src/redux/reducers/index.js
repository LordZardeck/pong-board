import { combineReducers } from 'redux';
import screens from './screens';
import players from './players';
import matches from './matches';
import auth from './auth';

export default combineReducers({ screens, players, matches, auth });
