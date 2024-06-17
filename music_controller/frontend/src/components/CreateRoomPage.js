import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link } from 'react-router-dom';


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

export default class RoomJoinPage extends Component {
    defaultVotes = 2;


    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes
        };

        // Bind these functions to the class to that it can use 'this' keyword 
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleVotesChanged = this.handleVotesChanged.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    }

    // Function to handle when the votes field is changed. Updates votesToSkip using the this.setState function 
    handleVotesChanged(e) {
        this.setState({
            votesToSkip: e.target.value
        });
    }

    // Function to handle when the guest can pause field is changed. Updates guestCanPause using the this.setState function 
    handleGuestCanPauseChange(e) {
        this.setState({
            // Set guestCanPause to true if 'true' is passed in, otherwise set to false (JavaScript inline if statement)
            guestCanPause: e.target.value === 'true' ? true : false
        });
    }

    handleRoomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        };
        fetch('/api/create-room', requestOptions).then((response) => response.json()
        ).then((data) => console.log(data));
    }

    render() {
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
                    <RadioGroup row defaultValue='true' onChange={this.handleGuestCanPauseChange}>
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
                    onChange={this.handleVotesChanged}
                    defaultValue={this.defaultVotes} 
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
                <Button color='primary' variant='contained' onClick={this.handleRoomButtonPressed}>Create a Room</Button>
            </Grid>
            <Grid item xs={12} align='center'>
                <Button color='secondary' variant='contained' to='/' component={Link}>Back</Button>
            </Grid>
        </Grid>
        );
    }
}