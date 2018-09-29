import React, {Component} from 'react';
import Card from './Card';
import './MatchPlayer.css';
import PlayerSelector from './PlayerSelector';


class MatchPlayer extends Component {
    static getMatches(player) {
        if (player.wins === void(0) || player.losses === void(0)) {
            return '';
        }

        return player.wins + player.losses;
    }

    hasCurrentPlayer() {
        return this.props.currentPlayer !== null && this.props.currentPlayer !== void(0);
    }

    render() {
        return (
            <div className={'match-player' + (this.hasCurrentPlayer() ? ' player-is-selected' : '')}>
                <div className={'selected-player' + (this.props.isWinning ? ' is-winning' : '')}>
                    {this.hasCurrentPlayer() ?
                        <Card title={this.props.currentPlayer.name}>
                            <img src={this.props.currentPlayer.avatar} alt="avatar"/>
                            <p><span className="darken">Rank</span> #{this.props.currentPlayer.rank}</p>
                            <p>{this.props.currentPlayer.score} Pts</p>
                            <hr/>
                            <dl>
                                <dt>Total Matches:</dt>
                                <dd>{MatchPlayer.getMatches(this.props.currentPlayer)}</dd>
                                <dt>Win : Loss</dt>
                                <dd>{this.props.currentPlayer.wins} : {this.props.currentPlayer.losses}</dd>
                            </dl>
                            <button onClick={() => this.props.onPlayerSelect(null)}>Back</button>
                        </Card>
                        : ''}
                </div>
                <PlayerSelector onPlayerSelect={playerId => this.props.onPlayerSelect(playerId)}/>
            </div>
        );
    }
}

export default MatchPlayer;
