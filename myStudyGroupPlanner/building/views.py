from django.shortcuts import render
from rest_framework import generics
from building.serializers import RoomSerializer
from models import Room

class RoomList(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class RoomDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer



#from rest_framework import permissions, viewsets
#from rest_framework.response import Response

#from building.models import Room
#from building.serializers import PostSerializer


#class RoomList(viewsets.ViewSet):
#    def list(self, request):
#        queryset = Room.objects.all()
#        serializer_class = RoomSerializer
#	return Response(serializer.data)
