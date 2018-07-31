import React, {Component} from 'react';
import Card from './Card';
import './Rankings.css';
import firebase from '../firebase';
import {getAbbreviatedPlayerName} from '../utilities/player';


class Rankings extends Component {
    state = {
        playerCollection: {}
    };

    componentDidMount() {
        // Updating the `someCollection` local state attribute when the Cloud Firestore 'someCollection' collection changes.
        this.unregisterCollectionObserver = firebase.firestore().collection('players').onSnapshot(snapshot => {
            const playerCollection = {};

            snapshot.forEach((playerSnapshot) => {
                playerCollection[playerSnapshot.id] = playerSnapshot.data();
            });

            this.setState({playerCollection});
        });
    }

    componentWillUnmount() {
        // Un-register the listeners.
        this.unregisterCollectionObserver();
    }

    render() {
        return (
            <div className="rankings">
                <Card title="Player Rankings">
                    <ul>
                        {Object.keys(this.state.playerCollection).map(playerId => (
                            <li key={playerId}>
                                <img src={this.state.playerCollection[playerId].avatar} alt="avatar"/>
                                <span
                                    className="player-name">{getAbbreviatedPlayerName(this.state.playerCollection[playerId])}</span>
                                <span className="ranking-badge">{this.state.playerCollection[playerId].score}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        );
    }
}

export default Rankings;