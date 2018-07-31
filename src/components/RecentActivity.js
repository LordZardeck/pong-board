import React, {Component} from 'react';
import Card from './Card';
import './RecentActivity.css';
import firebase from '../firebase';
import {getAbbreviatedPlayerName} from '../utilities/player';
import moment from 'moment';

class RecentActivity extends Component {
    state = {
        activityCollection: {}
    };

    componentDidMount() {
        // Updating the `someCollection` local state attribute when the Cloud Firestore 'someCollection' collection changes.
        this.unregisterCollectionObserver = firebase.firestore().collection('matches').onSnapshot(snapshot => {
            const activityCollection = {};

            Promise.all(snapshot.docs.map((matchSnapshot) => {
                activityCollection[matchSnapshot.id] = matchSnapshot.data();

                const winnerUpdate = activityCollection[matchSnapshot.id].winner.get()
                                                                         .then(winner => activityCollection[matchSnapshot.id].winner = winner.data());
                const loserUpdate = activityCollection[matchSnapshot.id].loser.get()
                                                                        .then(loser => activityCollection[matchSnapshot.id].loser = loser.data());

                return Promise.all([winnerUpdate, loserUpdate]);
            })).then(() => this.setState({activityCollection}));
        });
    }

    componentWillUnmount() {
        // Un-register the listeners.
        this.unregisterCollectionObserver();
    }

    getRecentActivity() {
        let matches = Object.keys(this.state.activityCollection).map(matchId => {
            let match = this.state.activityCollection[matchId];
            match.matchId = matchId;

            return match;
        });

        matches.sort((leftMatch, rightMatch) => rightMatch.timestamp - leftMatch.timestamp);

        return matches;
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

export default RecentActivity;