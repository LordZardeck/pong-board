import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actionsMap from '../redux/actions/matches';
import './PointTracker.css';

class PointTracker extends Component {
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

    render() {
        return (
            <div className="point-tracker">
                <div className="scoring">
                    {this.props.leftPlayer !== null &&
                    <img className={this.props.leftScore >= this.props.rightScore ? 'is-winning' : ''}
                         src={this.getPlayerData(this.props.leftPlayer).avatar} alt="avatar"/>}
                    <input type="tel" onBlur={event => PointTracker.onTargetBlur(event.target)}
                           onFocus={event => PointTracker.onTargetFocus(event.target)}
                           onChange={event => this.props.updateLeftScore(event.target.value)}
                           value={this.props.leftScore}/>
                    <input type="tel" onBlur={event => PointTracker.onTargetBlur(event.target)}
                           onFocus={event => PointTracker.onTargetFocus(event.target)}
                           onChange={event => this.props.updateRightScore(event.target.value)} value={this.props.rightScore}/>
                    {this.props.rightPlayer !== null &&
                    <img className={this.props.rightScore >= this.props.leftScore ? 'is-winning' : ''}
                         src={this.getPlayerData(this.props.rightPlayer).avatar} alt="avatar"/>}
                </div>
                <hr/>
                <button className="reset" onClick={() => this.props.resetMatch()}>Reset Match</button>
                <button className="submit" onClick={() => this.props.completeMatch()}>Submit Match</button>
            </div>
        );
    }
}

export default connect(state => ({...state.matches, registeredPlayers: state.players.registeredPlayers}), actionsMap)(PointTracker);
