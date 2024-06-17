import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


// Using a function-based React component as it seems easier to access URL params that way 
const Room = () => {
    const { roomCode } = useParams();
    console.log(roomCode);
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    getRoomDetails();

    function getRoomDetails() {
        let url = 'http://localhost:8000/api/get-room?code=' + roomCode;
        console.log(url);
        fetch(url).then((response) => 
        response.json()
        ).then((data) => {
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
            setIsHost(data.is_host);
        });
    }
    


    return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guest Can Pause: {guestCanPause.toString()}</p>
            <p>Host: {isHost.toString()}</p>
        </div>
    );
};

export default Room;


