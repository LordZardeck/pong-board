import React, {Component} from 'react';
import Card from './Card';
import './PlayerSelector.css';
import firebase from '../firebase';
import {getAbbreviatedPlayerName} from '../utilities/player';

class PlayerSelector extends Component {
    state = {
        playerCollection: {}
    };

    componentDidMount() {
        // Updating the `someCollection` local state attribute when the Cloud Firestore 'someCollection' collection changes.
        this.unregisterCollectionObserver = firebase.firestore().collection('players').onSnapshot(snapshot => {
            const playerCollection = {};

            snapshot.docs.forEach(playerSnapshot => {
                playerCollection[playerSnapshot.id] = playerSnapshot.data();
            });

            this.setState({playerCollection})
        });
    }

    componentWillUnmount() {
        // Un-register the listeners.
        this.unregisterCollectionObserver();
    }

    notifyPlayerSelect(playerId) {
        if (typeof this.props.onPlayerSelect !== 'function') {
            return;
        }

        this.props.onPlayerSelect(playerId, this.state.playerCollection[playerId]);
    }

    render() {
        return (
            <div className="choose-player">
                <Card>
                    <div className="list-container">
                        <ul>
                            {Object.keys(this.state.playerCollection).map(playerId => (
                                <li key={playerId}>
                                    <button onClick={() => this.notifyPlayerSelect(playerId)}>{getAbbreviatedPlayerName(
                                        this.state.playerCollection[playerId])}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>
        );
    }
}

export default PlayerSelector;