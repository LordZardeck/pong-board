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

    getSortedPlayerCollection() {
        let players = Object.keys(this.state.playerCollection).map(playerId => {
            let player = this.state.playerCollection[playerId];
            player.playerId = playerId;

            return player;
        });

        players.sort((leftPlayer, rightPlayer) => rightPlayer.score - leftPlayer.score);

        return players;
    }

    render() {
        return (
            <div className="rankings">
                <Card title="Player Rankings">
                    <ul>
                        {this.getSortedPlayerCollection().map(player => (
                            <li key={player.playerId}>
                                <img src={player.avatar} alt="avatar"/>
                                <span
                                    className="player-name">{getAbbreviatedPlayerName(player)}</span>
                                <span className="ranking-badge">{player.score}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        );
    }
}

export default Rankings;