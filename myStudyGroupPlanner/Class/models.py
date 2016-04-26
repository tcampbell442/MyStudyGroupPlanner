from django.db import models

class Subject(models.Model):
	subject = models.CharField(max_length=32)

	def __unicode__(self):
		return self.subject

class Class(models.Model):
	subject = models.ForeignKey(Subject, related_name="subjects", null=True)	
	subjectsClass = models.CharField(max_length=32)

	def __unicode__(self):
		return self.subjectsClass

class Section(models.Model):
	subjectsClass = models.ForeignKey(Class, related_name="Classes", null=True)	
	section = models.IntegerField()

	def __unicode__(self):
		return self.section
