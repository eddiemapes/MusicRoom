import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

import CreateRoomPage from './CreateRoomPage';
import RoomJoinPage from './RoomJoinPage';


export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <p>This is the home page</p>;
    }
}