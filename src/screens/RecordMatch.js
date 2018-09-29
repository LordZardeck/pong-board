import React, {Component} from 'react';
import {connect} from 'react-redux';
import './RecordMatch.css';
import MatchPlayer from '../components/MatchPlayer';
import PointTracker from '../components/PointTracker';
import {selectLeftPlayer, selectRightPlayer} from '../redux/actions/matches';

class RecordMatch extends Component {
    render() {
        return (
            <div className="record-match">
                <MatchPlayer currentPlayer={this.props.registeredPlayers[this.props.leftPlayer]}
                             isWinning={this.props.leftScore === this.props.rightScore || this.props.leftScore > this.props.rightScore}
                             onPlayerSelect={playerId => this.props.selectLeftPlayer(playerId)}/>
                <PointTracker/>
                <MatchPlayer currentPlayer={this.props.registeredPlayers[this.props.rightPlayer]}
                             isWinning={this.props.leftScore === this.props.rightScore || this.props.rightScore > this.props.leftScore}
                             onPlayerSelect={playerId => this.props.selectRightPlayer(playerId)}/>
            </div>
        );
    }
}

export default connect(state => ({
    ...state.matches,
    registeredPlayers: state.players.registeredPlayers
}), {selectLeftPlayer, selectRightPlayer})(RecordMatch);
