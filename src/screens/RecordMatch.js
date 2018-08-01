import React, {Component} from 'react';
import './RecordMatch.css';
import MatchPlayer from '../components/MatchPlayer';
import PointTracker from '../components/PointTracker';
import firebase from '../firebase';
import Elo from 'arpad';

class RecordMatch extends Component {
    state = {
        leftPlayerIsWinning: true,
        rightPlayerIsWinning: true,
        leftPlayer: void(0),
        rightPlayer: void(0)
    };

    constructor(props) {
        super(props);

        this.leftPlayer = React.createRef();
        this.rightPlayer = React.createRef();
    }

    getPlayerReference(id) {
        return firebase.firestore().doc(`/players/${id}`);
    }

    onPointGain(leftPoint, rightPoint) {
        this.setState(oldState => {
            oldState.leftPlayerIsWinning = leftPoint >= rightPoint;
            oldState.rightPlayerIsWinning = rightPoint >= leftPoint;

            return oldState;
        });
    }

    onMatchComplete(leftPoint, rightPoint) {
        const leftPlayerId = this.leftPlayer.current.getPlayerId(),
            rightPlayerId = this.rightPlayer.current.getPlayerId();

        const playerData = {};

        playerData[leftPlayerId] = this.leftPlayer.current.getPlayer();
        playerData[rightPlayerId] = this.rightPlayer.current.getPlayer();

        if (leftPlayerId === null || rightPlayerId === null || leftPlayerId === rightPlayerId) {
            return;
        }

        const matchResult = {
            winningScore: Math.max(leftPoint, rightPoint),
            losingScore: Math.min(leftPoint, rightPoint),
            timestamp: Date.now()
        };

        const winnerId = matchResult.winningScore === leftPoint ? leftPlayerId : rightPlayerId;
        const loserId = matchResult.losingScore === leftPoint ? leftPlayerId : rightPlayerId;

        const winnerDocRef = firebase.firestore().collection('players').doc(winnerId);
        const loserDocRef = firebase.firestore().collection('players').doc(loserId);

        firebase.firestore()
                .runTransaction(
                    transaction => {
                        const elo = new Elo(),
                            winnerScore = playerData[winnerId].score,
                            loserScore = playerData[loserId].score;

                        transaction.update(winnerDocRef,
                                           {
                                               score: elo.newRatingIfWon(winnerScore, loserScore),
                                               wins: playerData[winnerId].wins + 1
                                           });
                        transaction.update(loserDocRef,
                                           {
                                               score: elo.newRatingIfLost(loserScore, winnerScore),
                                               losses: playerData[loserId].losses + 1
                                           });

                        return Promise.resolve();
                    }
                );

        matchResult.winner = this.getPlayerReference(winnerId);
        matchResult.loser = this.getPlayerReference(loserId);

        firebase.firestore().collection('matches').add(matchResult);
    }

    onMatchReset() {
        this.setState({leftPlayerIsWinning: true, rightPlayerIsWinning: true});
        this.leftPlayer.current.selectPlayer(null, {});
        this.rightPlayer.current.selectPlayer(null, {});
    }

    onLeftPlayerSelect(playerId, playerData) {
        let leftPlayer = void(0);

        if (typeof playerData === 'object' && playerId !== null) {
            leftPlayer = playerData;
            leftPlayer.id = playerId;
        }

        this.setState({leftPlayer});
    }

    onRightPlayerSelect(playerId, playerData) {
        let rightPlayer = void(0);

        if (typeof playerData === 'object' && playerId !== null) {
            rightPlayer = playerData;
            rightPlayer.id = playerId;
        }

        this.setState({rightPlayer});
    }

    getExcludedPlayers() {
        const excludedPlayers = [];

        if (this.state.leftPlayer !== void(0)) {
            excludedPlayers.push(this.state.leftPlayer.id);
        }

        if (this.state.rightPlayer !== void(0)) {
            excludedPlayers.push(this.state.rightPlayer.id);
        }

        return excludedPlayers;
    }

    render() {
        return (
            <div className="record-match">
                <MatchPlayer ref={this.leftPlayer}
                             excludedPlayers={this.getExcludedPlayers()}
                             onPlayerSelect={(playerId, playerData) => this.onLeftPlayerSelect(playerId, playerData)}
                             isWinning={this.state.leftPlayer}/>
                <PointTracker onMatchReset={() => this.onMatchReset()}
                              onMatchComplete={(leftPoint, rightPoint) => this.onMatchComplete(leftPoint, rightPoint)}
                              onPointGain={(leftPoint, rightPoint) => this.onPointGain(leftPoint, rightPoint)}
                              leftPlayer={this.state.leftPlayer}
                              rightPlayer={this.state.rightPlayer}/>
                <MatchPlayer ref={this.rightPlayer}
                             excludedPlayers={this.getExcludedPlayers()}
                             onPlayerSelect={(playerId, playerData) => this.onRightPlayerSelect(playerId, playerData)}
                             isWinning={this.state.rightPlayerIsWinning}/>
            </div>
        );
    }
}

export default RecordMatch;