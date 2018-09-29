import React, {Component} from 'react';
import Card from './Card';
import './PlayerSelector.css';
import {getAbbreviatedPlayerName} from '../utilities/player';
import {connect} from 'react-redux';

class PlayerSelector extends Component {
    getAvailablePlayers() {
        const excludedPlayers = [this.props.leftPlayer, this.props.rightPlayer];

        return Object.keys(this.props.registeredPlayers).filter(playerId => excludedPlayers.indexOf(playerId) < 0 && this.props.registeredPlayers[playerId].hidden !== true);
    }

    render() {
        return (
            <div className="choose-player">
                <Card>
                    <div className="list-container">
                        <ul>
                            {this.getAvailablePlayers().map(playerId => (
                                <li key={playerId}>
                                    <button onClick={() => this.props.onPlayerSelect(playerId)}>
                                        {getAbbreviatedPlayerName(this.props.registeredPlayers[playerId])}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>
        );
    }
}

export default connect(state => ({
    ...state.players,
    leftPlayer: state.matches.leftPlayer,
    rightPlayer: state.matches.rightPlayer
}), null)(PlayerSelector);
