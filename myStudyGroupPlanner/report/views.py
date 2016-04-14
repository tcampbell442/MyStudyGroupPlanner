from django.shortcuts import render
from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from report.serializers import ReportSerializer
from models import Report
# Create your views here.
class ReportList(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    @api_view(['GET', 'POST'])
    def reportRequest(request):
	"""
	List all Reports or create a new report
	"""
	if request.method =='GET':
		reports = Report.objects.all()
		serializer = ReportSerializer(reports, many=Ture)
		return Response(serializer.data)

	elif request.method =='POST':
		serializer = ReportSerializer(data=request.DATA)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReportDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

	@api_view(['GET', 'PUT', 'DELETE'])
    def groupRequest(request, i):

	report = Report.objects.get(i)

	if request.method == 'GET':
		serializer = ReportSerializer(report)
		return Response(serializer.data)

	elif request.method == 'PUT':
		serializer = ReportSerializer(report, data=request.DATA)
		if serializer.is_valid():
		    serializer.save()
		    return Response(serializer.data)
		else:
		    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	elif request.method == 'DELETE':
		report.delete()
	    	return Response(status=status.HTTP_204_NO_CONTENT)
