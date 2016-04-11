from django.db import models

# Create your models here.
class Meeting(models.Model):
    name = models.CharField(max_length=16, unique=True, blank=True)
    room_num = models.CharField(max_length=3, blank=True, unique=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    users_attending = models.IntegerField()
