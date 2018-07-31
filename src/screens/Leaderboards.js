import React, {Component} from 'react';
import './Leaderboards.css';
import Rankings from '../components/Rankings';
import RecentActivity from '../components/RecentActivity';
import WinningStreak from '../components/WinningStreak';
import ConsecutiveLoss from '../components/ConsecutiveLoss';

class Leaderboards extends Component {
    render() {
        return (
            <div className="leaderboards">
                <div>
                    <div className="streaks">
                        <WinningStreak/>
                        <ConsecutiveLoss/>
                    </div>
                    <RecentActivity/>
                </div>
                <Rankings/>
            </div>
        );
    }
}

export default Leaderboards;