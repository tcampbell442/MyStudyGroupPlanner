from rest_framework import serializers
from msgpUser.models import MSGPUser

#from group.serializers import GroupSerializer
#from report.serializers import ReportSerializer

class MSGPUserSerializer(serializers.ModelSerializer):
	
	#groups = GroupSerializer()
	
	class Meta:	
		
		model = MSGPUser
		field = ('msgpUserId', 'msgpUsername', 'msgpGroupId', 'msgpGroupName')
		
		
