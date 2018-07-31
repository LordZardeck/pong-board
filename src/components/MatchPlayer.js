import React, {Component} from 'react';
import Card from './Card';
import './MatchPlayer.css';
import PlayerSelector from './PlayerSelector';

class MatchPlayer extends Component {
    state = {
        playerIsSelected: false,
        playerId: null,
        player: {}
    };

    getPlayerId() {
        return this.state.playerId;
    }

    getPlayer() {
        return this.state.player;
    }

    selectPlayer(playerId, playerData) {
        this.setState(
            {
                playerIsSelected: !!(playerId && playerData),
                playerId,
                player: playerData
            }
        );

        if (typeof this.props.onPlayerSelect !== 'function') {
            return;
        }

        this.props.onPlayerSelect(playerId, playerData);
    }

    getMatches(player) {
        if (player.wins === void(0) || player.losses === void(0)) {
            return '';
        }

        return player.wins + player.losses;
    }

    render() {
        return (
            <div className={'match-player' + (this.state.playerIsSelected ? ' player-is-selected' : '')}>
                <div className={'selected-player' + (this.props.isWinning ? ' is-winning' : '')}>
                    <Card title={this.state.player.name}>
                        <img src={this.state.player.avatar} alt="avatar"/>
                        <p><span className="darken">Rank</span> #{this.state.player.rank}</p>
                        <p>{this.state.player.score} Pts</p>
                        <hr/>
                        <dl>
                            <dt>Total Matches:</dt>
                            <dd>{this.getMatches(this.state.player)}</dd>
                            <dt>Win : Loss</dt>
                            <dd>{this.state.player.wins} : {this.state.player.losses}</dd>
                        </dl>
                        <button onClick={() => this.selectPlayer(null, {})}>Back</button>
                    </Card>
                </div>
                <PlayerSelector onPlayerSelect={(playerId, playerData) => this.selectPlayer(playerId, playerData)}/>
            </div>
        );
    }
}

export default MatchPlayer;