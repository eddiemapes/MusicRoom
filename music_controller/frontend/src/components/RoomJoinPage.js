import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const RoomJoinPage = (props) => {
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');


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

    function handleTextFieldChange(e) {
        setRoomCode(e.target.value);
    }

    function handleRoomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
            body: JSON.stringify({
                code: roomCode
            })
        };
        fetch('http://127.0.0.1:8000/api/join-room/', requestOptions).then((response) => {
        if (response.ok) {
            const url = `/room/${roomCode}`;
            console.log('redirecting to: ' + url);
            navigate(url);
        } else {
            console.log(response.error);
            setError('Room not found.');
        }
        }).catch((error) => {
        console.log(error);
        });
    }



    return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Typography variant='h4' component='h4'>Join a Room</Typography>
      </Grid>
      <Grid item xs={12} align='center' >
        <TextField 
        error={error}
        label='Code'
        placeholder='Enter a Room Code'
        value={roomCode}
        helperText={error ? 'Room not found.': ''}
        variant='outlined'
        onChange={handleTextFieldChange} 
        />
      </Grid>
      <Grid item xs={12} align='center' >
        <Button variant='contained' color='primary' onClick={handleRoomButtonPressed}>Enter Room</Button>
      </Grid>
      <Grid item xs={12} align='center' >
        <Button variant='contained' color='secondary' to='/' component={Link}>Back</Button>
      </Grid>
    </Grid>
  );

};

export default RoomJoinPage;