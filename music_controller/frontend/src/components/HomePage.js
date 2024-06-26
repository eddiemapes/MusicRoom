import React, { useState, useEffect } from 'react';
import { useParams, BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Grid, Button, ButtonGroup, Typography } from '@mui/material';

import CreateRoomPage from './CreateRoomPage';
import RoomJoinPage from './RoomJoinPage';
import Room from './Room';


const HomePage = () => {
    const [roomCode, setRoomCode] = useState(null);

    // Similar to componentDidMount
    useEffect(() => {
        fetch('/api/user-in-room/')
        .then((response) => response.json())
        .then((data) => {
            setRoomCode(data.code);
        });
    });

    const renderHomePage = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align='center'>
                    <Typography variant='h3' component='h3'>House Party</Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <ButtonGroup disableElevation variant='contained' color='primary'>
                        <Button color='primary' to='/join' component={Link}>Join a Room</Button>
                        <Button color='secondary' to='/create' component={Link}>Create a Room</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    };
    // Initialize Room component with props to return 
    const RoomWithProps = (props) => {
        const { roomCode } = useParams();
        return <Room {...props} roomCode={roomCode} leaveRoomCallback={clearRoomCode} />;
    };

    // Set the room code state to null if the room is left 
    function clearRoomCode() {
        setRoomCode(null);
    }

    return (
        <Router>
            <Routes>
                <Route path='/' element={
                    roomCode ? (
                        <Navigate to={`/room/${roomCode}`} />
                    ) : (
                        renderHomePage()
                    )
                } />
                <Route path='/join' element={<RoomJoinPage />} />
                <Route path='/create' element={<CreateRoomPage />} />
                <Route path='/room/:roomCode' element={<RoomWithProps />} />
            </Routes>
        </Router>);
};

export default HomePage;

 

/* <Route path='/' element={
                    renderHomePage()} /> */

/* <Route path='/room/:roomCode' element={<Room />} /> */