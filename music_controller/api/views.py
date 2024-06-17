from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializesr

class RoomView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

# POST request for creating rooms 
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializesr

    # Override post method 
    def post(self, request, format=None):
        # Check if a session already exists. If not, create one 
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # Get the data using the serializer class 
        serializer = self.serializer_class(data=request.data)

        # Check that the data is valid 
        if serializer.is_valid():
            # Set variables equal to serialized fields 
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            # Check if the host already has a room 
            queryset = Room.objects.filter(host=host)
            # If so, update the fields with the new details (using the update fields parameter)
            if queryset.exists():
                print()
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            # Otherwise, create a new room 
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()

            # Return a response sending the data to the RoomSerializer to be serialized into JSON 
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        

# Retrives data for a specific room when sent a room code 
class GetRoom(APIView):
    serializer_class = RoomSerializer
    # This looks in the URL for a keyword parameter. For example: /api/get-room?code=example 
    lookup_url_kwarg = 'code'

    # Override the get method for GET requests 
    def get(self, request, format=None):
        # Takes the parameter from the URL and assigns to variable 
        code = request.GET.get(self.lookup_url_kwarg)
        self.serializer_class
        if code:
            room = Room.objects.filter(code=code)
            if room:
                data = RoomSerializer(room[0]).data
                # Sets 'is_host' = true/false if the session key equals the host 
                data['is_host'] = self.request.session.session_key == room[0].host
                # If a room with the passed-in code is successfully found 
                return Response(data=data, status=status.HTTP_200_OK)
            # If a room with the passed-in code is NOT successfully found 
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        # If no code was passed into the URL as a parameter 
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)





