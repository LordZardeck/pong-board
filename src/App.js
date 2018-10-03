import React, {Component} from 'react';
import './App.css';
import LeaderBoards from './screens/Leaderboards';
import RecordMatch from './screens/RecordMatch';
import NavBar from './components/NavBar';
import {connect} from 'react-redux';
import {Screens} from "./redux/actions/screens";
import {subscribeConsecutiveLosses, subscribeConsecutiveWins, subscribePlayersSnapshot} from './redux/actions/players';
import {subscribeMatchesSnapshot} from "./redux/actions/matches";
import PlayerSelector from "./components/PlayerSelector";
import TopNav from "./components/TopNav";

class App extends Component {
    componentDidMount() {
        this.props.subscribePlayersSnapshot();
        this.props.subscribeMatchesSnapshot();
        this.props.subscribeConsecutiveWins();
        this.props.subscribeConsecutiveLosses();
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
        return (
            <div className="App">
                <TopNav/>
                <div className="contents">
                    {this.getActiveScreen()}
                </div>
                <NavBar />
                {this.props.showPlayerSelector && <PlayerSelector />}
            </div>
        );
    }
}

export default connect(state => ({ currentScreen: state.screens.currentScreen, showPlayerSelector: state.matches.showPlayerSelector}), {subscribePlayersSnapshot, subscribeMatchesSnapshot, subscribeConsecutiveWins, subscribeConsecutiveLosses})(App);
