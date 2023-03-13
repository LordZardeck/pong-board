import React, {Component} from 'react';
import './TopNav.css';
import paddles from "../pongboardlogo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AddPlayer from "./AddPlayer";

class TopNav extends Component {
    state = {
        showAddPlayer: false
    }

    showAddPlayer(showAddPlayer = true) {
        this.setState({showAddPlayer});
    }

    render() {
        return (
            <div className="top-nav">
                <img className="logo" src={paddles}/>
                <button className="new-player" onClick={this.showAddPlayer.bind(this)}>
                    <FontAwesomeIcon icon="plus-circle" className="add-icon"/>
                    Add Player
                </button>
                {this.state.showAddPlayer && <AddPlayer onCancel={() => this.showAddPlayer(false)}/>}
            </div>
        );
    }
}

export default TopNav;
