import React, {Component} from 'react';
import './PointTracker.css';

class PointTracker extends Component {
    constructor(props) {
        super(props);

        this.state = {leftScore: 0, rightScore: 0};
    }

    notifyPointUpdate(leftScore, rightScore) {
        if (typeof this.props.onPointGain !== 'function') {
            return;
        }

        this.props.onPointGain(leftScore, rightScore);
    }

    notifyMatchComplete() {
        if (typeof this.props.onMatchComplete !== 'function' || (this.state.leftScore <= 0 && this.state.rightScore <= 0)) {
            return;
        }

        this.props.onMatchComplete(this.state.leftScore, this.state.rightScore);
    }

    notifyMatchReset() {
        if (typeof this.props.onMatchComplete !== 'function') {
            return;
        }

        this.props.onMatchReset();
    }

    scoreLeft(event) {
        const leftScore = event.target.value;

        this.setState(() => {
            this.notifyPointUpdate(leftScore, this.state.rightScore);

            return {leftScore};
        });
    }

    scoreRight(event) {
        const rightScore = event.target.value;

        this.setState(() => {
            this.notifyPointUpdate(this.state.leftScore, rightScore);

            return {rightScore};
        });

    }

    completeMatch() {
        this.notifyMatchComplete();
        this.resetScore();
    }

    resetScore() {
        this.setState({leftScore: 0, rightScore: 0});
        this.notifyPointUpdate(0, 0);
        this.notifyMatchReset();
    }

    render() {
        return (
            <div className="point-tracker">
                <div className="scoring">
                    <input type="tel" onChange={event => this.scoreLeft(event)} value={this.state.leftScore}/>
                    <input type="tel" onChange={event => this.scoreRight(event)} value={this.state.rightScore}/>
                </div>
                <hr/>
                <button className="reset" onClick={() => this.resetScore()}>Reset Match</button>
                <button className="submit" onClick={() => this.completeMatch()}>Submit Match</button>
            </div>
        );
    }
}

export default PointTracker;