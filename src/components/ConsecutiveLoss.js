import React, {Component} from 'react';
import Card from './Card';
import './WinningStreak.css';
import {connect} from 'react-redux';
import {getAbbreviatedPlayerName} from '../utilities/player';

class ConsecutiveLoss extends Component {
    getStreakText() {
        if(this.props.mostConsecutiveLosses === null) {
            return 'None';
        }

        const playerData = this.props.registeredPlayers[this.props.mostConsecutiveLosses];

        return `${getAbbreviatedPlayerName(playerData)} - ${playerData.consecutiveLosses}`;
    }

    render() {
        return (
            <div className="winning-streak">
                <Card title="Most Consecutive Losses">
                    <p className="streak">{this.getStreakText()}</p>
                </Card>
            </div>
        );
    }
}

export default connect(state => ({...state.players}))(ConsecutiveLoss);
