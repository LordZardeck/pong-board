import React, {Component} from 'react';
import './Leaderboards.css';
import Rankings from '../components/Rankings';
import RecentActivity from '../components/RecentActivity';
import WinningStreak from '../components/WinningStreak';
import ConsecutiveLoss from '../components/ConsecutiveLoss';
import PointTracker from "../components/PointTracker";

class Leaderboards extends Component {
    render() {
        return (
            <div className="leaderboards-container">
                <PointTracker/>
                <div className="leaderboards">
                    <Rankings/>
                    <div className="leaderboards-second-column">
                        <div className="streaks">
                            <WinningStreak/>
                            <ConsecutiveLoss/>
                            <PointTracker/>
                        </div>
                        <RecentActivity/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Leaderboards;
