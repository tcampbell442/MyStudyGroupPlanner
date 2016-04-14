from django.shortcuts import render
from rest_framework import generics

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from report.serializers import ReportSerializer
from models import Report

class ReportList(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    @api_view(['GET','POST'])
    def reportRequest(request):
        if request.method == 'GET':
            reports = Report.objects.all()
            serializer = ReportSerializer(reports,many=True)
            return Response
        elif request.method == 'POST':
            serializer = ReportSerializer(data=request.DATA)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status.HTTP_201_CREATED)
            else:
                return Response(serializer.erros, status=status.HTTP_400_BAD_REQUEST)


class ReportDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    @api_view(['GET','PUT','DELETE'])
    def detailRequest(request, i):
        report = report.objects.get(i)
        if request.method == 'GET':
            serialzer = ReportSerializer(report)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = ReportSerializer(report, data=request.DATA)
            if serializer.is_valid():
                serializer.save()
                return Response(serilizer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            report.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
