from rest_framework import serializers
from building.models import Room, Hours, Day

class HoursSerializer(serializers.ModelSerializer):
    class Meta:
	model = Hours
	field =('id', 'start_hour', 'end_hour', 'room')

class DaySerializer(serializers.ModelSerializer):
    class Meta:
	model = Day
	field = ('id', 'day')

class RoomSerializer(serializers.ModelSerializer):
    hours = HoursSerializer(many=True)
    days = DaySerializer(many=True)

    class Meta:
	model = Room
	field = ('id', 'name', 'room_num')


    #def create(self, validated_data):
#	room = Room.objects.create(**validated_data)
#
#	for item in validated_data['hours']:
#	    hours = Hours.object.create(id=item['page_id'], start_hour=item['start_hour'], end_hour=item['end_hour'], room=room)
#	return Room
