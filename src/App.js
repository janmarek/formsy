import React, { Component } from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Route,
    NavLink
} from 'react-router-dom'
import ValidationPage from './demo/ValidationPage';
import BasicFormPage from './demo/BasicFormPage';
import RepeaterPage from './demo/RepeaterPage';
import CustomSetPage from './demo/CustomSetPage';
import ReduxPage from './demo/ReduxPage';

class App extends Component {

    render() {
        return <Router>
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to Formsy</h1>
                </header>
                <div className="menu">
                    <NavLink to="/basic" activeClassName="active">Basic Example</NavLink>
                    <NavLink to="/validation" activeClassName="active">Validation</NavLink>
                    <NavLink to="/repeater" activeClassName="active">Repeater</NavLink>
                    <NavLink to="/redux" activeClassName="active">Redux</NavLink>
                    <NavLink to="/custom-set" activeClassName="active">Custom Set Value</NavLink>
                </div>
                <div className="App-intro">
                    <Route path="/basic" component={BasicFormPage} />
                    <Route path="/validation" component={ValidationPage} />
                    <Route path="/repeater" component={RepeaterPage} />
                    <Route path="/custom-set" component={CustomSetPage} />
                    <Route path="/redux" component={ReduxPage} />
                </div>
            </div>
        </Router>;
    }

}

export default App;
