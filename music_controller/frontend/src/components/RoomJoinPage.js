import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props);

    this.csrfToken = this.getCookie('csrftoken');

    this.state = {
      roomCode: '',
      error: ''
    }
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
  }

  

// Cookie function for CSRF token 
getCookie(name) {
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



  handleTextFieldChange(e) {
    this.setState({
      roomCode: e.target.value,
    });
  }

  handleRoomButtonPressed() {
    const requestOptions = {
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': this.csrfToken
        },
      body: JSON.stringify({
        code: this.state.roomCode
      })
    };
    fetch('http://127.0.0.1:8000/api/join-room/', requestOptions).then((response) => {
      if (response.ok) {
        const url = `/room/${this.state.roomCode}`;
        console.log('redirecting to: ' + url);
        window.location.replace(url);
      } else {
        console.log(response.error);
        this.setState({error: 'Room not found.'});
      }
    }).catch((error) => {
      console.log(error);
    });
  }

render() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Typography variant='h4' component='h4'>Join a Room</Typography>
      </Grid>
      <Grid item xs={12} align='center' >
        <TextField 
        error={this.state.error}
        label='Code'
        placeholder='Enter a Room Code'
        value={this.state.roomCode}
        helperText={this.state.error ? 'Room not found.': ''}
        variant='outlined'
        onChange={this.handleTextFieldChange} 
        />
      </Grid>
      <Grid item xs={12} align='center' >
        <Button variant='contained' color='primary' onClick={this.handleRoomButtonPressed}>Enter Room</Button>
      </Grid>
      <Grid item xs={12} align='center' >
        <Button variant='contained' color='secondary' to='/' component={Link}>Back</Button>
      </Grid>
    </Grid>
  );
};
}