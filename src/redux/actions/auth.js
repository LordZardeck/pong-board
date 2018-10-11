import {createActions} from 'redux-actions';
import firebase from "../../firebase";

export const {changeAuth, updateTeam} = createActions('CHANGE_AUTH', 'UPDATE_TEAM');

let unregisterAuthStateChange = null;

const firebaseCreateTeam = firebase.functions().httpsCallable('createTeam');

export function getUserTeams(userId) {
    return firebase.firestore()
        .doc(`/users/${userId}`)
        .collection('teams')
        .get()
        .then(teamsSnapshot => teamsSnapshot.docs);
}

export function createTeam(teamName) {
    return dispatch => {
        return new Promise(resolve => setTimeout(() => resolve(dispatch(updateTeam({
            teamId: 'asdfasd',
            id: '42245'
        }), 10 * 60 * 1000))));

        // return firebaseCreateTeam({teamName}).then(result => {
        //     dispatch(updateTeam(result.data));
        // });
    }
}

export function logout() {
    return dispatch => {
        firebase.auth().signOut();
        dispatch(changeAuth(null));
    }
}

export function subscribeAuthStateChange() {
    return dispatch => {
        if (unregisterAuthStateChange !== null) {
            unregisterAuthStateChange();
            unregisterAuthStateChange = null;
        }

        unregisterAuthStateChange = firebase.auth().onAuthStateChanged(user => {
            return getUserTeams(user.uid).then(teams => {
                teams = teams.map(team => ({...team.data(), id: team.id}));
                dispatch(changeAuth({
                    ...user,
                    teams
                }));
            });
        });
    };
}
