import React, {Component} from 'react';
import './App.css';
import LeaderBoards from './screens/Leaderboards';
import {connect} from 'react-redux';
import {subscribeConsecutiveLosses, subscribeConsecutiveWins, subscribePlayersSnapshot} from './redux/actions/players';
import {subscribeMatchesSnapshot} from "./redux/actions/matches";
import {subscribeAuthStateChange} from "./redux/actions/auth";
import PlayerSelector from "./components/PlayerSelector";
import TopNav from "./components/TopNav";
import SignIn from './screens/SignIn';
import RegisterOrJoin from './screens/RegisterOrJoin';
import {Transition} from "react-spring";

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
        if (this.props.hasInitialized === false) {
            return styles => <div style={styles}/>;
        }

        if (this.props.user === null) {
            return styles => <SignIn style={styles}/>;
        }

        if (this.props.user.teams.length === 0) {
            return styles => <RegisterOrJoin style={styles}/>;
        }

        return styles => (
            <div className="App" style={styles}>
                <TopNav/>
                <div className="contents">
                    <LeaderBoards/>
                </div>
                {this.props.showPlayerSelector && <PlayerSelector/>}
            </div>
        );
    }

    render() {
        return (
            <Transition from={{opacity: 0}}
                        enter={{opacity: 1}}
                        leave={{opacity: 0}}>
                {this.getActiveScreen()}
            </Transition>
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
