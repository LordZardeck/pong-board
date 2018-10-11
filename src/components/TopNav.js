import React, {Component} from 'react';
import './TopNav.css';
import paddles from "../pongboardlogo.png";
import {logout} from "../redux/actions/auth";
import {connect} from "react-redux";

class TopNav extends Component {
    render() {
        return (
            <div className="top-nav">
                <div className="logo">
                    <img src={paddles}/>
                </div>
                <div className="right-nav">
                    {/*{this.props.user !== null ? <img src={this.props.user.photoURL} /> : ''}*/}
                    <button onClick={() => this.props.logout()}>Logout</button>
                </div>
            </div>
        );
    }
}

export default connect(null, {logout})(TopNav);
