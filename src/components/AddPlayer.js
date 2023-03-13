import React, {Component} from 'react';
import './AddPlayer.css';
import Card from "./Card";
import {connect} from "react-redux";
import * as actionsMap from "../redux/actions/players";

class AddPlayer extends Component {
    onCancel() {
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel();
        }
    }

    onSubmit(event) {
        event.preventDefault()

        const formData = new FormData(event.target);

        if (formData.get('firstName') === '' || formData.get('lastName') === '') {
            alert('First and last name are required');
            return;
        }

        this.props.registerPlayer(formData.get('firstName'), formData.get('lastName'), formData.get('avatar'));

        this.onCancel()
    }

    render() {
        return (
            <React.Fragment>
                <div className="add-player-overlay"/>
                <div className="add-player-modal">
                    <Card>
                        <form onSubmit={this.onSubmit.bind(this)}>
                            <input name='firstName' placeholder="First Name"/>
                            <input name='lastName' placeholder="Last Name"/>
                            <input name='avatar' placeholder="Avatar Url"/>
                            <button className="add-player-submit" type="submit">Add Player</button>
                            <button className="add-player-cancel" onClick={this.onCancel.bind(this)}>Cancel</button>
                        </form>
                    </Card>
                </div>
            </React.Fragment>
        );
    }
}


export default connect(() => ({}), actionsMap)(AddPlayer);
