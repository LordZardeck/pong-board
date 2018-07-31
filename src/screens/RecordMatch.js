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
        leftPlayerAvatar: void(0),
        rightPlayerAvatar: void(0)
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

                        transaction.update(winnerDocRef, {score: elo.newRatingIfWon(winnerScore, loserScore)});
                        transaction.update(loserDocRef, {score: elo.newRatingIfLost(loserScore, winnerScore)});

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
        let leftPlayerAvatar = void(0);

        if (typeof playerData === 'object' && playerData.avatar !== void(0)) {
            leftPlayerAvatar = playerData.avatar;
        }

        this.setState({leftPlayerAvatar});
    }

    onRightPlayerSelect(playerId, playerData) {
        let rightPlayerAvatar = void(0);

        if (typeof playerData === 'object' && playerData.avatar !== void(0)) {
            rightPlayerAvatar = playerData.avatar;
        }

        this.setState({rightPlayerAvatar});
    }

    render() {
        return (
            <div className="record-match">
                <MatchPlayer ref={this.leftPlayer}
                             onPlayerSelect={(playerId, playerData) => this.onLeftPlayerSelect(playerId, playerData)}
                             isWinning={this.state.leftPlayerIsWinning}/>
                <PointTracker onMatchReset={() => this.onMatchReset()}
                              onMatchComplete={(leftPoint, rightPoint) => this.onMatchComplete(leftPoint, rightPoint)}
                              onPointGain={(leftPoint, rightPoint) => this.onPointGain(leftPoint, rightPoint)}
                              leftPlayerAvatar={this.state.leftPlayerAvatar}
                              rightPlayerAvatar={this.state.rightPlayerAvatar}/>
                <MatchPlayer ref={this.rightPlayer}
                             onPlayerSelect={(playerId, playerData) => this.onRightPlayerSelect(playerId, playerData)}
                             isWinning={this.state.rightPlayerIsWinning}/>
            </div>
        );
    }
}

export default RecordMatch;