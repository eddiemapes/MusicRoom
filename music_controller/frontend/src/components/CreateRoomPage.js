import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link, useNavigate } from 'react-router-dom';
import RoomJoinPage from './RoomJoinPage';


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

const CreateRoomPage = (props) => {
    const defaultVotes = 2;
    const [guestCanPause, setGuestCanPause] = useState(true);
    const[votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const navigate = useNavigate();


const handleVotesChanged = (e) => {
    setVotesToSkip(e.target.value);
};

const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === 'true' ? true : false);
};

const handleRoomButtonPressed = () => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            'votes_to_skip': votesToSkip,
            'guest_can_pause': guestCanPause
        }),
    };
    fetch('http://127.0.0.1:8000/api/create-room', requestOptions)
    .then((response) => response.json())
    .then((data) => navigate('/room/' + data.code + '?createHost=true'))
};

    return (
        
        // Parent grid 
        <Grid container spacing={1}>
            {/* Title  */}
            <Grid item xs={12} align='center'>
                <Typography component='h4' variant='h4'>Create a Room</Typography>
            </Grid>
            <Grid item xs={12} align='center'>
                <FormControl component='fieldset'>
                    <FormHelperText>
                        <span align='center'>Guest Control of Playback State</span>
                    </FormHelperText>
                    <RadioGroup row defaultValue='true' onChange={handleGuestCanPauseChange}>
                        <FormControlLabel 
                        value='true' 
                        control={<Radio color='primary' />}
                        label='Play/Pause'
                        labelPlacement='bottom'
                        />
                        <FormControlLabel 
                        value='false' 
                        control={<Radio color='secondary' />}
                        label='No Control'
                        labelPlacement='bottom'
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align='center'>
                <FormControl>
                    <TextField 
                    required={true} 
                    type='number'
                    onChange={handleVotesChanged}
                    defaultValue={defaultVotes} 
                    inputProps={{
                        min: 1,
                        style: {textAlign: 'center'}
                    }} 
                    />
                    <FormHelperText>
                        <span align='center'>Votes Required to Skip Song</span>
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} align='center'>
                <Button color='primary' variant='contained' onClick={handleRoomButtonPressed}>Create a Room</Button>
            </Grid>
            <Grid item xs={12} align='center'>
                <Button color='secondary' variant='contained' to='/' component={Link}>Back</Button>
            </Grid>
        </Grid>
    );
};

export default CreateRoomPage;