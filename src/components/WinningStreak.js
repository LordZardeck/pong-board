import React, {Component} from 'react';
import Card from './Card';
import './WinningStreak.css';
import {connect} from 'react-redux';
import {getAbbreviatedPlayerName} from '../utilities/player';

class WinningStreak extends Component {
    getStreakText() {
        if(this.props.bestWinningStreak === null) {
            return 'None';
        }

        const playerData = this.props.registeredPlayers[this.props.bestWinningStreak];

        return `${getAbbreviatedPlayerName(playerData)} - ${playerData.consecutiveWins}`;
    }

    render() {
        return (
            <div className="winning-streak">
                <Card title="Best Winning Streak">
                    <p className="streak">{this.getStreakText()}</p>
                </Card>
            </div>
        );
    }
}

export default connect(state => ({...state.players}))(WinningStreak);
