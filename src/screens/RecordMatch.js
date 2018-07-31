import React, {Component} from 'react';
import './RecordMatch.css';
import MatchPlayer from '../components/MatchPlayer';
import PointTracker from '../components/PointTracker';
import firebase from '../firebase';

class RecordMatch extends Component {
    state = {
        leftPlayerIsWinning: true,
        rightPlayerIsWinning: true
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
        const matchResult = {
            winningScore: Math.max(leftPoint, rightPoint),
            losingScore: Math.min(leftPoint, rightPoint),
            timestamp: Date.now()
        };

        matchResult.winner = this.getPlayerReference(
            matchResult.winningScore === leftPoint ? this.leftPlayer.current.getPlayerId() : this.rightPlayer.current.getPlayerId()
        );
        matchResult.loser = this.getPlayerReference(
            matchResult.losingScore === leftPoint ? this.leftPlayer.current.getPlayerId() : this.rightPlayer.current.getPlayerId()
        );

        firebase.firestore().collection('matches').add(matchResult);
    }

    onMatchReset() {
        this.setState({leftPlayerIsWinning: true, rightPlayerIsWinning: true});
        this.leftPlayer.current.clearPlayer();
        this.rightPlayer.current.clearPlayer();
    }

    render() {
        return (
            <div className="record-match">
                <MatchPlayer ref={this.leftPlayer} isWinning={this.state.leftPlayerIsWinning}/>
                <PointTracker onMatchReset={() => this.onMatchReset()}
                              onMatchComplete={(leftPoint, rightPoint) => this.onMatchComplete(leftPoint, rightPoint)}
                              onPointGain={(leftPoint, rightPoint) => this.onPointGain(leftPoint, rightPoint)}/>
                <MatchPlayer ref={this.rightPlayer} isWinning={this.state.rightPlayerIsWinning}/>
            </div>
        );
    }
}

export default RecordMatch;