import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actionsMap from '../redux/actions/matches';
import './PointTracker.css';
import {getAbbreviatedPlayerName} from '../utilities/player';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Card from "./Card";

class PointTracker extends Component {
    state = {showPlayerSelector: false};

    static onTargetFocus(target) {
        target.value = null;
    }

    static onTargetBlur(target) {
        if (isNaN(parseInt(target.value, 10))) {
            target.value = 0;
        }
    }

    getPlayerData(playerId) {
        return this.props.registeredPlayers[playerId];
    }

    getLeftPlayerCard() {
        if (this.props.leftPlayer === null) {
            return '';
        }

        return (
            <div className={'player' + (this.props.leftScore >= this.props.rightScore ? ' is-winning' : '')}>
                <p className="player-name">{getAbbreviatedPlayerName(this.getPlayerData(this.props.leftPlayer))}</p>
                <img src={this.getPlayerData(this.props.leftPlayer).avatar} alt="avatar"/>
                <input type="tel" onBlur={event => PointTracker.onTargetBlur(event.target)}
                       onFocus={event => PointTracker.onTargetFocus(event.target)}
                       onChange={event => this.props.scoreLeft(event.target.value)} value={this.props.leftScore}/>
            </div>
        );
    }

    getRightPlayerCard() {
        if (this.props.rightPlayer === null) {
            return '';
        }

        return (
            <div className={'player' + (this.props.rightScore >= this.props.leftScore ? ' is-winning' : '')}>
                <p className="player-name">{getAbbreviatedPlayerName(this.getPlayerData(this.props.rightPlayer))}</p>
                <img src={this.getPlayerData(this.props.rightPlayer).avatar} alt="avatar"/>
                <input type="tel" onBlur={event => PointTracker.onTargetBlur(event.target)}
                       onFocus={event => PointTracker.onTargetFocus(event.target)}
                       onChange={event => this.props.scoreRight(event.target.value)} value={this.props.rightScore}/>
            </div>
        );
    }

    getPlayerPicker() {
        return (
            <div className="player select">
                <a href="javascript:void(0)" onClick={() => this.props.togglePlayerSelector(true)}>
                    <FontAwesomeIcon icon="plus-circle" />
                    <p>Select a Player</p>
                </a>
            </div>
        );
    }

    render() {
        return (
            <div className="point-tracker">
                <Card>
                    <div className="active-players">
                        {this.getLeftPlayerCard()}
                        {this.getRightPlayerCard()}
                        {this.props.leftPlayer === null || this.props.rightPlayer === null ? this.getPlayerPicker() : ''}
                    </div>
                    <hr/>
                    <button className="reset" onClick={() => this.props.resetMatch()}>Reset Match</button>
                    <button className="submit" onClick={() => this.props.completeMatch()}>Submit Match</button>
                </Card>
            </div>
        );
    }
}

export default connect(state => ({
    ...state.matches,
    registeredPlayers: state.players.registeredPlayers
}), actionsMap)(PointTracker);
