from django.db import models
import datetime

DAYS_OF_WEEK = (
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday'),
)

class Room(models.Model):
    name = models.CharField(max_length=16, unique=True, blank=True)
    room_num = models.CharField(max_length=3, blank=True, unique=True)
    #hours = models.ForeignKey(Hours, on_delete=models.CASCADE, related_name='hours', blank=True, null=True)
    #days = models.ForeignKey(Day, on_delete=models.CASCADE)

class Hours(models.Model):
    room = models.ForeignKey(Room, related_name="hours", null=True)
    start_hour = models.TimeField(blank=True, default=datetime.time())
    end_hour = models.TimeField(blank=True, default=datetime.time())

#    def __unicode__(self):
#	return self.start_hour
#	return "start: " + self.start_hour + " end: " + self.end_hour 

class Day(models.Model):
    room = models.ForeignKey(Room, related_name="days", null=True)
    day = models.CharField(max_length=1, choices=DAYS_OF_WEEK)

#    def __unicode__(self):
#    return self.day

