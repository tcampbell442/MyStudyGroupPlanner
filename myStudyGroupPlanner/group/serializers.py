from rest_framework import serializers
from group.models import Group, User
#from authentication.serializers import AccountSerializer

class UserSerializer(serializers.ModelSerializer):
	class Meta:	
		model = User
		field = ('id', 'email', 'username',
			'first_name', 'last_name', 'tagline',)

class GroupSerializer(serializers.ModelSerializer):

	# ADDED THIS LINE FOR GROUP FOREIGN KEY RELATIONSHIP
	#users = AccountSerializer(many=True, read_only=True, required=False)
	users = UserSerializer(many=True, read_only=True)

	class Meta:
		model = Group
		field = ('subject', 
				 'className', 
				 'section', 
				 'groupOwner', 
				 'memberCount', 
				 'totalMembersAllowed', 
				 'access',
				 'users',)
		
		
