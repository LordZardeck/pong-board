import React, {Component} from 'react';
import './NavBar.css';

class NavBar extends Component {
    notifyScreenChange(newScreen) {
        if (newScreen === this.props.activeScreen) {
            return;
        }

        this.props.onScreenChange(newScreen);
    }

    render() {
        return (
            <div className="navbar">
                {Object.keys(this.props.screens).map(screen => (
                    <div key={screen} className={'nav-link' + (this.props.activeScreen === screen ? ' active' : '')}>
                        <button onClick={() => this.notifyScreenChange(screen)}>{this.props.screens[screen]}</button>
                    </div>
                ))}
            </div>
        );
    }
}

export default NavBar;