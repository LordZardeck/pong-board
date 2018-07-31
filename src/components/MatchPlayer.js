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

    clearPlayer() {
        this.setState({playerIsSelected: false, playerId: null});
    }

    getPlayerId() {
        return this.state.playerId;
    }

    onPlayerSelect(playerId, playerData) {
        this.setState(
            {
                playerIsSelected: true,
                playerId,
                player: playerData
            }
        );
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
                            <dd>{this.state.player.matches}</dd>
                            <dt>Win : Loss</dt>
                            <dd>{this.state.player.wins} : {this.state.player.losses}</dd>
                        </dl>
                        <button onClick={() => this.clearPlayer()}>Back</button>
                    </Card>
                </div>
                <PlayerSelector onPlayerSelect={(playerId, playerData) => this.onPlayerSelect(playerId, playerData)}/>
            </div>
        );
    }
}

export default MatchPlayer;