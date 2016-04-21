from django.db import models
#from group.models import Group
#from report.models import Report

class MSGPUser(models.Model):

	msgpUserId = models.IntegerField()
	msgpUsername = models.CharField(max_length=40)
	msgpGroupId = models.IntegerField()
	msgpGroupName = models.CharField(max_length=40)
	
	class Meta:	
		unique_together = (("msgpUserId", "msgpGroupId"))
