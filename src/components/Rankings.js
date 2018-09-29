import React, {Component} from 'react';
import Card from './Card';
import {connect} from 'react-redux';
import './Rankings.css';
import {getAbbreviatedPlayerName} from '../utilities/player';


class Rankings extends Component {
    getSortedPlayerCollection() {
        let players = Object.keys(this.props.registeredPlayers).map(playerId => {
            let player = this.props.registeredPlayers[playerId];
            player.playerId = playerId;

            return player;
        }).filter(player => player.hidden !== true);

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

export default connect(state => ({...state.players}))(Rankings);
