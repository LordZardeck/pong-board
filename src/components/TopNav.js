import React, {Component} from 'react';
import './TopNav.css';
import paddles from "../pongboardlogo.png";
import NavBar from "./NavBar";

class TopNav extends Component {
    render() {
        return (
            <div className="top-nav">
                <div className="logo">
                    <img src={paddles}/>
                </div>

                <NavBar/>
            </div>
        );
    }
}

export default TopNav;
