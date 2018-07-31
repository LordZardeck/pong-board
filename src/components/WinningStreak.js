import React, {Component} from 'react';
import Card from './Card';
import './WinningStreak.css';

class WinningStreak extends Component {
    render() {
        return (
            <div className="winning-streak">
                <Card title="Best Winning Streak">
                    <p className="streak">Sean T - 1</p>
                </Card>
            </div>
        );
    }
}

export default WinningStreak;