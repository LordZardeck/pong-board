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

    scoreLeft(value) {
        const leftScore = parseInt(value, 10);

        if (isNaN(leftScore)) {
            return;
        }

        this.setState(() => {
            this.notifyPointUpdate(leftScore, this.state.rightScore);

            return {leftScore};
        });
    }

    scoreRight(value) {
        const rightScore = parseInt(value, 10);

        if (isNaN(rightScore)) {
            return;
        }

        this.setState(() => {
            this.notifyPointUpdate(this.state.leftScore, rightScore);

            return {rightScore};
        });

    }

    onTargetFocus(target) {
        target.value = null;
    }

    onTargetBlur(target) {
        if (isNaN(parseInt(target.value, 10))) {
            target.value = 0;
        }
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
                    <input type="tel" onBlur={event => this.onTargetBlur(event.target)}
                           onFocus={event => this.onTargetFocus(event.target)}
                           onChange={event => this.scoreLeft(event.target.value)}
                           value={this.state.leftScore}/>
                    <input type="tel" onBlur={event => this.onTargetBlur(event.target)}
                           onFocus={event => this.onTargetFocus(event.target)}
                           onChange={event => this.scoreRight(event.target.value)} value={this.state.rightScore}/>
                </div>
                <hr/>
                <button className="reset" onClick={() => this.resetScore()}>Reset Match</button>
                <button className="submit" onClick={() => this.completeMatch()}>Submit Match</button>
            </div>
        );
    }
}

export default PointTracker;