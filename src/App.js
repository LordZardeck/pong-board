import React, {Component} from 'react';
import './App.css';
import LeaderBoards from './screens/Leaderboards';
import RecordMatch from './screens/RecordMatch';
import {connect} from 'react-redux';
import {Screens} from "./redux/actions/screens";
import {subscribeConsecutiveLosses, subscribeConsecutiveWins, subscribePlayersSnapshot} from './redux/actions/players';
import {subscribeMatchesSnapshot} from "./redux/actions/matches";
import {subscribeAuthStateChange} from "./redux/actions/auth";
import PlayerSelector from "./components/PlayerSelector";
import TopNav from "./components/TopNav";
import SignIn from './screens/SignIn';
import RegisterOrJoin from './screens/RegisterOrJoin';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {hasInitialized: false};
    }

    componentDidMount() {
        this.props.subscribePlayersSnapshot();
        this.props.subscribeMatchesSnapshot();
        this.props.subscribeConsecutiveWins();
        this.props.subscribeConsecutiveLosses();
        this.props.subscribeAuthStateChange();
    }

    getActiveScreen() {
        switch (this.props.currentScreen) {
            case Screens.RecordMatch:
                return <RecordMatch/>;
            case Screens.LeaderBoards:
            default:
                return <LeaderBoards/>;
        }
    }

    render() {
        if(this.props.hasInitialized === false) {
            return '';
        }

        if (this.props.user === null) {
            return <SignIn/>;
        }

        if(this.props.user.teams.length === 0) {
            return <RegisterOrJoin/>
        }

        return (
            <div className="App">
                <TopNav/>
                <div className="contents">
                    <LeaderBoards/>
                </div>
                {this.props.showPlayerSelector && <PlayerSelector/>}
            </div>
        );
    }
}

export default connect(state => ({
    currentScreen: state.screens.currentScreen,
    showPlayerSelector: state.matches.showPlayerSelector,
    ...state.auth
}), {
    subscribePlayersSnapshot,
    subscribeMatchesSnapshot,
    subscribeConsecutiveWins,
    subscribeConsecutiveLosses,
    subscribeAuthStateChange
})(App);
