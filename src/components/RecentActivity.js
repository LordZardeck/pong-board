import React, {Component} from 'react';
import Card from './Card';
import './RecentActivity.css';
import {getAbbreviatedPlayerName} from '../utilities/player';
import moment from 'moment';
import {connect} from 'react-redux';

class RecentActivity extends Component {
    getRecentActivity() {
        return Object.keys(this.props.activityCollection).map(matchId => {
            let match = this.props.activityCollection[matchId];
            match.matchId = matchId;

            return match;
        });
    }

    render() {
        return (
            <div className="recent-activity">
                <Card title="Recent Activity"/>
                {this.getRecentActivity().map(match => {
                    const winner = this.props.registeredPlayers[match.winner];
                    const loser = this.props.registeredPlayers[match.loser];

                    return (
                        <div key={match.matchId} className="match">
                            <Card>
                                <div className="player winner">
                                    <img src={winner.avatar}/>
                                    <span className="name">{getAbbreviatedPlayerName(winner)}</span>
                                </div>
                                <div className="info">
                                    <div className="score">{match.winningScore} - {match.losingScore}</div>
                                    <span className="activity-time">{moment(match.timestamp).fromNow()}</span>
                                </div>
                                <div className="player loser">
                                    <img src={loser.avatar}/>
                                    <span className="name">{getAbbreviatedPlayerName(loser)}</span>
                                </div>
                            </Card>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default connect(state => ({
    activityCollection: state.matches.latestMatches,
    registeredPlayers: state.players.registeredPlayers
}))(RecentActivity);
