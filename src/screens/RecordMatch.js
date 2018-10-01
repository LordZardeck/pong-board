import React, {Component} from 'react';
import {connect} from 'react-redux';
import './RecordMatch.css';
import PointTracker from '../components/PointTracker';
import {selectLeftPlayer, selectRightPlayer} from '../redux/actions/matches';

class RecordMatch extends Component {
    render() {
        return (
            <div className="record-match">
                <PointTracker/>
            </div>
        );
    }
}

export default connect(state => ({
    ...state.matches,
    registeredPlayers: state.players.registeredPlayers
}), {selectLeftPlayer, selectRightPlayer})(RecordMatch);
