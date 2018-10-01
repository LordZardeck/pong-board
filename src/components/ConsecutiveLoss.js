import React, {Component} from 'react';
import Card from './Card';
import './WinningStreak.css';
import {connect} from 'react-redux';
import {getAbbreviatedPlayerName} from '../utilities/player';

class ConsecutiveLoss extends Component {
    getStreakText() {
        if (this.props.mostConsecutiveLosses === null) {
            return <p className="streak-name">None</p>;
        }

        const playerData = this.props.registeredPlayers[this.props.mostConsecutiveLosses];

        return (
            <p className="streak">
                <span className="streak-name">{getAbbreviatedPlayerName(playerData)}</span>
                <span className="streak-score">{playerData.consecutiveLosses}</span>
            </p>
        );
    }

    render() {
        return (
            <div className="winning-streak">
                <Card title="Most Consecutive Losses">
                    {this.getStreakText()}
                </Card>
            </div>
        );
    }
}

export default connect(state => ({...state.players}))(ConsecutiveLoss);
