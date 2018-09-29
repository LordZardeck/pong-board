import React, {Component} from 'react';
import './App.css';
import LeaderBoards from './screens/Leaderboards';
import RecordMatch from './screens/RecordMatch';
import NavBar from './components/NavBar';
import {connect} from 'react-redux';
import {Screens} from "./redux/actions/screens";
import {subscribePlayersSnapshot} from './redux/actions/players';
import {subscribeMatchesSnapshot} from "./redux/actions/matches";

class App extends Component {
    componentDidMount() {
        this.props.subscribePlayersSnapshot();
        this.props.subscribeMatchesSnapshot();
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
                <div className="contents">
                    {this.getActiveScreen()}
                </div>
                <NavBar />
            </div>
        );
    }
}

export default connect(state => ({ currentScreen: state.screens.currentScreen}), {subscribePlayersSnapshot, subscribeMatchesSnapshot})(App);
