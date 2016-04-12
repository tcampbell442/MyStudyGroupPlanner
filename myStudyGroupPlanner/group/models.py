from django.db import models

class Group(models.Model):
	
	groupName = models.CharField(max_length=20)
	subject = models.CharField(max_length=30)
	className = models.CharField(max_length=30)
	section = models.IntegerField()
	groupOwner = models.CharField(max_length=30)
	memberCount = models.IntegerField()
	totalMembersAllowed = models.IntegerField()
	meetingPermissions = models.CharField(max_length=20)
	access = models.CharField(max_length=10)