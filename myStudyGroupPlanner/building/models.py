from django.db import models

DAYS_OF_WEEK = (
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday'),
)

#class Hours(models.Model):
#    start_hour = models.TimeField(blank=True)
#    end_hour = models.TimeField(blank=True)

#    def __unicode__(self):
#	return self.start_hour
#	return "start: " + self.start_hour + " end: " + self.end_hour 

#class Day(models.Model):
#    day = models.CharField(max_length=1, choices=DAYS_OF_WEEK)

#    def __unicode__(self):
#	return self.day

class Room(models.Model):
    name = models.CharField(max_length=16, unique=True, blank=True)
    room_num = models.CharField(max_length=3, blank=True, unique=True)
    #hours = models.ForeignKey(Hours, on_delete=models.CASCADE)
    #days = models.ForeignKey(Day, on_delete=models.CASCADE)
