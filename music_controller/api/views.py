from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import uuid
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer

class RoomView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

# POST request for creating rooms 
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    # Override post method 
    def post(self, request, format=None):
        # Check if a session already exists. If not, create one

        # Get the data using the serializer class 
        serializer = self.serializer_class(data=request.data)
        # Check that the data is valid 
        if serializer.is_valid():
            # Set variables equal to serialized fields 
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = str(uuid.uuid4())
            print(host)
            # Check if the host already has a room 
            queryset = Room.objects.filter(host=host)
            # If so, update the fields with the new details (using the update fields parameter)
            if len(queryset) > 0:
                # Gets the room object 
                room = queryset[0]
                # Update fields 
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                # Save object 
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
            # Otherwise, create a new room 
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
            # Return a response sending the data to the RoomSerializer to be serialized into JSON 
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        else:
            return Response({'Error in post request': 'Invalid data provided'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# Retrives data for a specific room when sent a room code 
class GetRoom(APIView):
    serializer_class = RoomSerializer
    # This looks in the URL for a keyword parameter. For example: /api/get-room?code=example 
    lookup_url_kwarg = 'code'

    # Override the get method for GET requests 
    def get(self, request, format=None):

        
        # Takes the parameter from the URL and assigns to variable
        host = self.request.GET.get('host_token', {})
        code = request.GET.get(self.lookup_url_kwarg)

        # self.serializer_class
        if code:
            room = Room.objects.filter(code=code)
            if room:
                this_room_code = room[0].host
                data = RoomSerializer(room[0]).data
                # Sets 'is_host' = true/false if the host key equals the room host
                is_host = (host == this_room_code)
                print(is_host)
                data['is_host'] = is_host
                # If a room with the passed-in code is successfully found 
                return Response(data=data, status=status.HTTP_200_OK)
            # If a room with the passed-in code is NOT successfully found 
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        # If no code was passed into the URL as a parameter 
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class JoinRoom(APIView):
    lookup_url_kwarg = 'code'
    
    def post(self, request, format=None):
        
        
        # Check if a session already exists. If not, create one
        if not self.request.session.session_key:
            self.request.session.create()
            self.request.session.save()

        code = request.data.get(self.lookup_url_kwarg)
        if code:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
            # If a room was not found 
            return Response({'Bad Request': 'Unable to find room'}, status=status.HTTP_404_NOT_FOUND)
        # If room code was not sent 
        return Response({'Bad Request': 'Invalid POST data, did not find code key'}, status=status.HTTP_400_BAD_REQUEST)
    

class UserInRoom(APIView):
    def get(self, request, format=None):
        # Check if a session already exists. If not, create one
        if not self.request.session.session_key:
            self.request.session.create()
            self.request.session.save()

        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data=data, status=status.HTTP_200_OK)
    
class LeaveRoom(APIView):
    def post(self, request, format=None):
        # Get the host first and if it exists, execute delete code 
        host_id = request.data.get('host_token')
        if host_id:
            if 'room_code' in self.request.session:
                code = self.request.session.pop('room_code')
                host_id = self.request.session.session_key
                room_results = Room.objects.filter(code=code)
                if len(room_results):
                    room = room_results[0]
                    room.delete()
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)





