from django.shortcuts import render
from rest_framework import generics

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from building.serializers import RoomSerializer
from models import Room

class RoomList(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    @api_view(['GET', 'POST'])
    def roomRequest(request):
	"""
	List all Rooms or create a new room.
	"""
	if request.method =='GET':
		rooms = Room.objects.all()
		serializer = RoomSerializer(rooms, many=Ture)
		return Response(serializer.data)

	elif request.meother =='POST':
		serializer = RoomSerializer(data=request.DATA)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoomDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    @api_view(['GET', 'PUT', 'DELETE'])
    def groupRequest(request, i):

	room = Room.objects.get(i)

	if request.method == 'GET':
		serializer = RoomSerializer(room)
		return Response(serializer.data)

	elif request.method == 'PUT':
		serializer = RoomSerializer(room, data=request.DATA)
		if serializer.is_valid():
		    serializer.save()
		    return Response(serializer.data)
		else:
		    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	elif request.method == 'DELETE':
	    room.delete()
	    return Response(status=status.HTTP_204_NO_CONTENT)	



