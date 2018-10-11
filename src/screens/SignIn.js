import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseApp from '../firebase';
import firebase from 'firebase';
import Card from "../components/Card";
import './SignIn.css';
import paddles from "../pongboardlogo.png";

// Configure FirebaseUI.
const uiConfig = {
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],

    callbacks: {
        signInSuccess: () => console.log('Signed in!')
    }
};

export default class SignInScreen extends React.Component {
    render() {
        return (
            <div className="sign-in">
                <Card>
                    <div className="logo">
                        <img src={paddles}/>
                    </div>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()}/>
                </Card>
            </div>
        );
    }
}
