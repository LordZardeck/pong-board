import React, {Component} from 'react';
import './Card.css';

class Card extends Component {
    render() {
        return (
            <div className="card">
                {
                    this.props.title &&
                    <h2 className="card-header">{this.props.title}</h2>
                }
                {this.props.children}
            </div>
        );
    }
}

export default Card;
