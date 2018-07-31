import React, {Component} from 'react';
import './App.css';
import Leaderboards from './screens/Leaderboards';
import RecordMatch from './screens/RecordMatch';
import NavBar from './components/NavBar';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {activeScreen: 'record-match'};
    }

    getActiveScreen() {
        switch (this.state.activeScreen) {
            case 'record-match':
                return <RecordMatch/>;
            case 'leaderboards':
            default:
                return <Leaderboards/>;
        }
    }

    changeScreen(screen) {
        this.setState({activeScreen: screen});
    }

    render() {
        return (
            <div className="App">
                <div className="contents">
                    {this.getActiveScreen()}
                </div>
                <NavBar screens={{'leaderboards': 'Leaderboards', 'record-match': 'Record Match'}}
                        activeScreen={this.state.activeScreen}
                        onScreenChange={newScreen => this.changeScreen(newScreen)}/>
            </div>
        );
    }
}

export default App;
