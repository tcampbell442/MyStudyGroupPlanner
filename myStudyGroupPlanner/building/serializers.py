from rest_framework import serializers
from building.models import Room

class HoursSerializer(serializers.ModelSerializer):
    class Meta:
	model = ('id', 'start_hour', 'end_hour')

class DaySerializer(serializers.ModelSerializer):
    class Meta:
	model = ('id', 'day')

class RoomSerializer(serializers.ModelSerializer):
    #hours = HoursSerializer()
    #days = DaySerializer()

    class Meta:
	model = Room
	field = ('id', 'name', 'room_num')
