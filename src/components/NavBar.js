import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeScreen, Screens} from '../redux/actions/screens';
import './NavBar.css';

const screenNameDisplayMap = {
    [Screens.LeaderBoards]: 'Leaderboards',
    [Screens.RecordMatch]: 'Record Match'
};

class NavBar extends Component {
    render() {
        return (
            <div className="navbar">
                {Object.keys(screenNameDisplayMap).map(screen => (
                    <div key={screen} className={'nav-link' + (this.props.currentScreen === screen ? ' active' : '')}>
                        <button onClick={() => this.props.changeScreen(screen)}>{screenNameDisplayMap[screen]}</button>
                    </div>
                ))}
            </div>
        );
    }
}

export default connect(state => ({currentScreen: state.screens.currentScreen}), {changeScreen})(NavBar);
