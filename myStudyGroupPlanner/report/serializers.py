from rest_framework import serializers
from report.models import Report
from authentication.models import Account

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        field = ('reporter','reportee','comments','date_submitted')
