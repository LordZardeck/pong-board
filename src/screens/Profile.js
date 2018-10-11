import React, {Component} from 'react';
import firebase from '../firebase';

class Profile extends Component {
    logout() {
        firebase.auth().signOut();
    }

    render() {
        return (
            <div className="profile">
                <h1>Profile</h1>
                {this.props.user !== null ? <img src={this.props.user.photoURL} /> : ''}
                <button onClick={() => this.logout()}>Logout</button>
            </div>
        );
    }
}

export default Profile;