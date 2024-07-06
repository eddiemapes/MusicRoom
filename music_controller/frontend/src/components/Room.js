import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@mui/material';

import CreateRoomPage from './CreateRoomPage';

const Room = ({ leaveRoomCallback }) => {
    const navigate = useNavigate();
    const { roomCode } = useParams();
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);

    // Function for retrieving room data
    const getRoomDetails = async () => {
        try {
            const hostToken = localStorage.getItem('host_token');
            let url = `http://localhost:8000/api/get-room?code=${roomCode}`;
            if (hostToken) {
                url = url + `&host_token=${hostToken}`;
            };
            const response = await fetch(url);
            if (!response.ok) {
                leaveRoomCallback();
                navigate('/');
            }
            const data = await response.json();
            console.log(data);
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
            console.log('host data from api: ' + data.is_host);
            const isHostValue = data.is_host === 'true';
            setIsHost(isHostValue);
        } catch (error) {
            console.error('Error fetching room details:', error.message);
            // Handle error condition (e.g., show error message)
        }
    };

    // Call backend to authenticate spotify 
    function authenticateSpotify() {
        fetch('/spotify/is-authenticated')
        .then((response) => response.json()
        .then((data) => {
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                fetch('/spotify/get-auth-url')
                .then((response) => response.json())
                .then((data) => {
                    window.location.replace(data.url);
                })
            }
        }))
    }

    useEffect(() => {
        getRoomDetails();
    }, [roomCode]); // Run effect whenever roomCode changes

    useEffect(() => {
        console.log('isHost updated:', isHost);
        if (isHost) {
            authenticateSpotify();
        }
    }, [isHost]);

    // Cookie function for CSRF token 
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrfToken = getCookie('csrftoken');

    const leaveRoom = () => {
        const hostToken = localStorage.getItem('host_token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                'host_token': hostToken
            })
        };
        fetch('/api/leave-room/', requestOptions).then((response) => {
            navigate('/');
        });
    };

    function updateShowSettings(value) {
        setShowSettings(value);
    }

    function renderSettingsButton() {
        return (
            <Grid item xs={12} align='center'>
                <Button variant='contained' color='primary' onClick={() => updateShowSettings(true)}>Settings</Button>
            </Grid>
        );
    }

    function renderSettings() {
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align='center'>
                <CreateRoomPage 
                update={true} 
                votes={votesToSkip} 
                pause={guestCanPause}
                roomCode={roomCode} 
                updateCallBack={getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align='center'>
                <Button variant='contained' color='secondary' onClick={() => updateShowSettings(false)}>Close</Button>
            </Grid>
        </Grid>
        );
    }

    if (showSettings) {
        return renderSettings();
    }
    return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <Typography variant='h4' component='h4'>Code: {roomCode}</Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Typography variant='h6' component='h6'>Votes to Skip: {votesToSkip}</Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Typography variant='h6' component='h6'>Guest Can Pause: {guestCanPause.toString()}</Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Typography variant='h6' component='h6'>Is Host: {isHost.toString()}</Typography>
                </Grid>
                {isHost ? renderSettingsButton() : null}
                <Grid item xs={12} align='center' >
                    <Button variant='contained' color='secondary' to='/' component={Link} onClick={leaveRoom}>Leave Room</Button>
                </Grid>
            </Grid>

            );
};

export default Room;