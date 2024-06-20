import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
    const { roomCode } = useParams();
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        // Function for retrieving room data
        const getRoomDetails = async () => {
            try {
                let url = `http://localhost:8000/api/get-room?code=${roomCode}`;
                
                const searchParams = new URLSearchParams(location.search);
                const createHost = searchParams.get('createHost');
                console.log('Create host:' + createHost);

                if (createHost === 'true') {
                    url += '&createHost=true';
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch room details');
                }
                const data = await response.json();
                console.log(data);
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
            } catch (error) {
                console.error('Error fetching room details:', error.message);
                // Handle error condition (e.g., show error message)
            }
        };

        getRoomDetails();
    }, [roomCode]); // Run effect whenever roomCode changes

    return (
        <div>
            <h3>Room Code: {roomCode}</h3>
            <p>Votes to Skip: {votesToSkip}</p>
            <p>Guest Can Pause: {guestCanPause.toString()}</p>
            <p>Is Host: {isHost.toString()}</p>
        </div>
    );
};

export default Room;