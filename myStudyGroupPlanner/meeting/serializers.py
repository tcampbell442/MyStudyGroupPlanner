from rest_framework import serializers
from meeting.models import Meeting



class MeetingSerializer(serializers.ModelSerializer):

    class Meta:
	model = Meeting
	field = ('id', 
			 'name', 
			 'start_date',
			 'end_date',
			 'start_time',
			 'end_time',
			 'users_attending',
			 'groupId')
