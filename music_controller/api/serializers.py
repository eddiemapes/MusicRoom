from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at']

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['guest_can_pause', 'votes_to_skip']

class UpdateRoomSerializer(serializers.ModelSerializer):
    # Redefine code field to not reference the model code that must be unique 
    code = serializers.CharField(validators=[])
    host = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ['guest_can_pause', 'votes_to_skip', 'code', 'host']
