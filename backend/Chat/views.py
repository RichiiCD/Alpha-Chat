import imp
import json
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Chat, Message, CommunityChat, FriendsChat
from .serializers import CommunityChatSerializer, FriendsChatSerializer, GetFriendsChatSerializer, MessageSerializer
from Communities.models import Community
from UserProfile.authentication import getUserAutenticated



@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def ChatApiView(request):
    '''
        API ENDPOINT FOR COMMUNITY CHATS MANAGMENT.

        Input for GET: {"type": "friends"/"community", "community": "..."}

        Input for POST:
            {   
                "type": "community",
                "community": 19,
                "name": "test"
            }
            {
                "type": "friends",
                "friends": [2]
            }
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'GET':
        if request.query_params.get('type') == 'community':
            try:    
                community = Community.objects.get(code=request.query_params.get('community'))
            except:
                return Response('Community not found', status=status.HTTP_400_BAD_REQUEST)
            if community.members.filter(id=user_autenticated.id).exists():
                chats = CommunityChat.objects.filter(community=community)
                chats_serializer = CommunityChatSerializer(chats, many=True)
                return Response(chats_serializer.data, status=status.HTTP_200_OK)
            return Response('User not allowed', status=status.HTTP_401_UNAUTHORIZED)
        else:
            friends_chats = FriendsChat.objects.filter(friends__id=user_autenticated.id)
            friends_chats_serializer = GetFriendsChatSerializer(friends_chats, many=True)
            return Response(friends_chats_serializer.data, status=status.HTTP_200_OK)
    
    if request.method == "POST":
        if request.data['type'] == "community":
            try:
                community = Community.objects.get(id=request.data['community'])
            except:
                return Response('Community not found', status=status.HTTP_401_UNAUTHORIZED)
            if community.admin_user == user_autenticated:
                chat_serializer = CommunityChatSerializer(data=request.data)
                if chat_serializer.is_valid():
                    chat_serializer.save()
                    return Response(chat_serializer.data, status=status.HTTP_200_OK)
                return Response(chat_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response('User not allowed', status=status.HTTP_401_UNAUTHORIZED)
        else:
            friends_chat_serializer = FriendsChatSerializer(data=request.data)
            if friends_chat_serializer.is_valid():
                friends_chat = friends_chat_serializer.create(validated_data=friends_chat_serializer.validated_data, auth_user=user_autenticated)
                return Response(GetFriendsChatSerializer(friends_chat).data, status=status.HTTP_200_OK)
            return Response(friends_chat_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == "PUT":
        try:
            chat = CommunityChat.objects.get(code=request.data['code'])
        except:
            return Response('Chat not found', status=status.HTTP_400_BAD_REQUEST)
        if chat.community.admin_user == user_autenticated: 
            chat_serializer = CommunityChatSerializer(chat, data=request.data)
            if chat_serializer.is_valid():
                chat_serializer.save()
                return Response('Chat updated', status=status.HTTP_200_OK)
            return Response(chat_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response('User not allowed', status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == "DELETE":
        try:
            chat = CommunityChat.objects.get(code=request.data['code'])
        except:
            return Response('Chat not found', status=status.HTTP_400_BAD_REQUEST)
        if chat.community.admin_user == user_autenticated:
            chat.delete()
            return Response('Chat deleted', status=status.HTTP_200_OK)
        return Response('User not allowed', status=status.HTTP_401_UNAUTHORIZED) 
            
        

@api_view(['GET'])
def ChatMessagesApiView(request):

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        try:
            chat = Chat.objects.get(code=request.query_params.get('chat'))
            messages = Message.objects.filter(chat=chat)
            messages_serializer = MessageSerializer(messages, many=True)
            return Response(messages_serializer.data, status=status.HTTP_200_OK)
        except:
            return Response("Chat not found", status=status.HTTP_404_NOT_FOUND)
