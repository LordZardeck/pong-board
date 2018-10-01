import React, {Component} from 'react';
import Card from './Card';
import './WinningStreak.css';
import {connect} from 'react-redux';
import {getAbbreviatedPlayerName} from '../utilities/player';

class WinningStreak extends Component {
    getStreakText() {
        if (this.props.bestWinningStreak === null) {
            return <p className="streak-name">None</p>;
        }

        const playerData = this.props.registeredPlayers[this.props.bestWinningStreak];

        return (
            <p className="streak">
                <span className="streak-name">{getAbbreviatedPlayerName(playerData)}</span>
                <span className="streak-score">{playerData.consecutiveWins}</span>
            </p>
        );
    }

    render() {
        return (
            <div className="winning-streak">
                <Card title="Best Winning Streak">
                    {this.getStreakText()}
                </Card>
            </div>
        );
    }
}

export default connect(state => ({...state.players}))(WinningStreak);
