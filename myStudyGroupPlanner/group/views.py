from django.shortcuts import render
from rest_framework import generics

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from group.serializers import GroupSerializer
from models import Group



class GroupList(generics.ListCreateAPIView):
	queryset = Group.objects.all()
	serializer_class = GroupSerializer
	
	@api_view(['GET', 'POST'])
	def groupRequest(request):
		"""
		List all tasks, or create a new task.
		"""
		if request.method == 'GET':
			groups = Group.objects.all()
			serializer = GroupSerializer(groups, many=True)
			return Response(serializer.data)

		elif request.method == 'POST':
			serializer = GroupSerializer(data=request.DATA)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data, status=status.HTTP_201_CREATED)
			else:
				return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
				
				

class GroupDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Group.objects.all()
	serializer_class = GroupSerializer
    
	@api_view(['GET', 'PUT', 'DELETE'])
	def groupRequest(request, i):
		
		group = Group.objects.get(i)

		if request.method == 'GET':
			serializer = GroupSerializer(group)
			return Response(serializer.data)

		elif request.method == 'PUT':
			serializer = GroupSerializer(group, data=request.DATA)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)
			else:
				return Response(serilizer.errors, status=status.HTTP_400_BAD_REQUEST)
				
		elif request.method == 'DELETE':
			group.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
