import React from 'react';
import Card from "../components/Card";
import './SignIn.css';
import './RegisterOrJoin.css';
import paddles from "../pongboardlogo.png";
import connect from "react-redux/es/connect/connect";
import {createTeam} from "../redux/actions/auth";

class RegisterOrJoin extends React.Component {
    state = {newTeamName: '', isCreatingTeam: false};

    createTeam(event) {
        const teamName = this.state.newTeamName;

        event.preventDefault();

        if (teamName === '') {
            return;
        }
        this.setState({isCreatingTeam: true});

        this.props.createTeam(teamName).then(() => this.setState({newTeamName: '', isCreatingTeam: false}));
    }

    render() {
        return (
            <div className="sign-in register-or-join">
                <Card>
                    <div className="logo">
                        <img src={paddles}/>
                    </div>
                    <div className={'panel-content ' + (this.state.isCreatingTeam ? 'loading' : '')}>
                        <form onSubmit={event => this.createTeam(event)}>
                            <h1 className="card-header">Register new Team</h1>
                            <input value={this.state.newTeamName} onChange={event => this.setState({newTeamName: event.target.value})} type="text"/>
                            <button className="submit">
                                Create Team
                            </button>
                        </form>
                        <form onSubmit={event => event.preventDefault()}>
                            <h1 className="card-header">Join Existing Team</h1>
                            <input type="text"/>
                            <button className="submit">Join Team</button>
                        </form>
                    </div>
                </Card>
            </div>
        );
    }
}

export default connect(null, {createTeam})(RegisterOrJoin);
