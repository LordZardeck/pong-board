import React, {Component} from 'react';
import './TopNav.css';
import paddles from "../pongboardlogo.png";

class TopNav extends Component {
    render() {
        return (
            <div className="top-nav">
                <div className="logo">
                    <img src={paddles}/>
                </div>
            </div>
        );
    }
}

export default TopNav;
