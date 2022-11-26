from os import stat
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Friends, FriendshipRequest
from django.contrib.auth.models import User
from .serializers import FriendsSerializer, FriendshipRequestSerializer, ProfileFriendshipRequestSerializer
from UserProfile.authentication import getUserAutenticated



@api_view(['GET', 'DELETE'])
def FriendsApiView(request):
    '''
        API ENDPOINT FOR USER FRIENDS MANAGMENT.

        Input for DELETE:
            {username: "pepe"}
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        friends = Friends.objects.get(user=user_autenticated)
        friends_serializer = FriendsSerializer(friends)
        return Response(friends_serializer.data, status=status.HTTP_200_OK)

    if request.method == "DELETE":
        try:
            user_remove = User.objects.get(username=request.data['username'])
        except:
            return Response("User not found", status=status.HTTP_400_BAD_REQUEST)
        friends = Friends.objects.get(user=user_autenticated)
        if friends.friends.filter(id=user_remove.id).exists():
            friends.friends.remove(user_remove)
            friends.save()
            return Response("Friendship removed", status=status.HTTP_200_OK)
        return Response("Friendship not found", status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'POST', 'DELETE'])
def FriendshipRequestApiView(request):
    '''
        API ENDPOINT FOR USER FRIENDSHIP REQUEST MANAGMENT.

        Input for POST:
            {"receiver": 1}
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        friendship_requests = FriendshipRequest.objects.filter(receiver=user_autenticated)
        friendship_requests_serializer = ProfileFriendshipRequestSerializer(friendship_requests, many=True)
        return Response(friendship_requests_serializer.data, status=status.HTTP_200_OK)
    
    if request.method == "POST":
        friendship_request_serializer = FriendshipRequestSerializer(data=request.data)
        if friendship_request_serializer.is_valid():
            post_result = friendship_request_serializer.create(validated_data=friendship_request_serializer.validated_data, sender=user_autenticated)
            if type(post_result) == str:
                return Response(post_result, status=status.HTTP_400_BAD_REQUEST)
            return Response('Friendship request sended', status=status.HTTP_200_OK)
        return Response(friendship_request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == "DELETE":
        try:
            friendship_request = FriendshipRequest.objects.get(id=request.data['id'])
        except:
            return Response("Friendship request not found")
        if friendship_request.sender == user_autenticated:
            friendship_request.delete()
            return Response('Friendship request removed', status=status.HTTP_200_OK)
        return Response('User not allowed', status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def FriendshipRequestResponseApiView(request):
    '''
        API ENDPOINT FOR USER FRIENDSHIP REQUEST RESPONSE.

        Input for POST:
            {
                "id": 15,
                "response": "accept"/"reject"
            }
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == "POST":
        try:
            friendship_request = FriendshipRequest.objects.get(id=request.data['id'])
        except:
            return Response('Friendship request not found', status=status.HTTP_400_BAD_REQUEST)
        if friendship_request.receiver == user_autenticated:
            if request.data['response'] == "accept":
                Friends.objects.get(user=friendship_request.receiver).friends.add(friendship_request.sender)
                Friends.objects.get(user=friendship_request.sender).friends.add(friendship_request.receiver)
                friendship_request.delete()
                return Response('Friendship request accepted', status=status.HTTP_200_OK)
            friendship_request.delete()
            return Response('Friendship request rejected', status=status.HTTP_200_OK)
        return Response('User not allowed', status=status.HTTP_400_BAD_REQUEST)
