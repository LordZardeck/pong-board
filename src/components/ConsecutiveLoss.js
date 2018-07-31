import React, {Component} from 'react';
import Card from './Card';
import './WinningStreak.css';

class ConsecutiveLoss extends Component {
    render() {
        return (
            <div className="winning-streak">
                <Card title="Most Consecutive Losses">
                    <p className="streak">Chad T - 1</p>
                </Card>
            </div>
        );
    }
}

export default ConsecutiveLoss;