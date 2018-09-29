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
                <Card title="Recent Activities">
                    <div className="list-container">
                        <ol>
                            {this.getRecentActivity().map(match => (
                                <li key={match.matchId}>
                                    <span
                                        className="winner-name">{getAbbreviatedPlayerName(match.winner)}</span> beat <span
                                    className="loser-name">{getAbbreviatedPlayerName(match.loser)}</span> ({match.winningScore} - {match.losingScore})
                                    - <span className="activity-time">{moment(match.timestamp).fromNow()}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </Card>
            </div>
        );
    }
}

export default connect(state => ({activityCollection: state.matches.latestMatches}))(RecentActivity);
