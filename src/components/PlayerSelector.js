import React, {Component} from 'react';
import './PlayerSelector.css';
import {connect} from 'react-redux';
import Card from "./Card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as actionsMap from '../redux/actions/matches';

class PlayerSelector extends Component {
    state = {searchText: ''};

    playerMeetsSearchCriteria(playerData) {
        return `${playerData.firstName} ${playerData.lastName}`.toLowerCase().indexOf(this.state.searchText.toLowerCase()) >= 0;
    }

    getAvailablePlayers() {
        const excludedPlayers = [this.props.leftPlayer, this.props.rightPlayer];

        return Object.keys(this.props.registeredPlayers)
            .filter(
                playerId =>
                    excludedPlayers.indexOf(playerId) < 0 &&
                    this.props.registeredPlayers[playerId].hidden !== true &&
                    this.playerMeetsSearchCriteria(this.props.registeredPlayers[playerId])
            );
    }

    static getMatches(player) {
        if (player.wins === void(0) || player.losses === void(0)) {
            return '';
        }

        return player.wins + player.losses;
    }

    getPlayerCard(playerId) {
        const playerData = this.props.registeredPlayers[playerId];


        return (
            <a key={playerId} href="javascript:void(0)" className="player-select" onClick={() => this.selectPlayer(playerId)}>
                <Card title={`${playerData.firstName} ${playerData.lastName}`}>
                    <img src={playerData.avatar} alt="avatar"/>
                </Card>
            </a>
        );
    }

    selectPlayer(playerId) {
        this.props[this.props.leftPlayer === null ? 'selectLeftPlayer' : 'selectRightPlayer'](playerId);
        this.props.togglePlayerSelector(false);
    }

    render() {
        return (
            <div className="choose-player">
                <div className="player-search">
                    <FontAwesomeIcon icon="search" />
                    <input type="text" onChange={event => this.setState({searchText: event.target.value})} value={this.state.searchText}/>
                </div>
                <div className="player-list">
                    {this.getAvailablePlayers().map(playerId => this.getPlayerCard(playerId))}
                </div>
            </div>
        );
    }
}

export default connect(state => ({
    ...state.players,
    leftPlayer: state.matches.leftPlayer,
    rightPlayer: state.matches.rightPlayer,
    showPlayerSelector: state.matches.showPlayerSelector
}), actionsMap)(PlayerSelector);
