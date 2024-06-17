import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';

import HomePage from './HomePage';
import CreateRoomPage from './CreateRoomPage';
import RoomJoinPage from './RoomJoinPage';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div>
         <HomePage />
        </div>
        );
    }
}

const appDiv = document.getElementById('app');
const root = ReactDOM.createRoot(appDiv);

root.render(<App />);