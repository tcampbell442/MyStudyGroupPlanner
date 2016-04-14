from django.db import models
from authentication.models import Account

# Create your models here.
class Report(models.Model):
    user = models.ForeignKey(Account, related_name="reports", null=True)
    comments = models.TextField()
    #reportingUser = models.Foreign(Account, related_name="reports", null=True)
