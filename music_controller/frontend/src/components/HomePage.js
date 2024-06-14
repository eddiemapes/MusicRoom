import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from 'react-router-dom';

import CreateRoomPage from './CreateRoomPage';
import RoomJoinPage from './RoomJoinPage';

const TestingComponent = () => <p>TESTING TEST</p>


export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <Router>
            <Routes>
                <Route exact path='/' element={<TestingComponent />} />
                <Route path='/join' component={RoomJoinPage} />
                <Route path='/create' component={CreateRoomPage} />
            </Routes>
        </Router>);
    }
}