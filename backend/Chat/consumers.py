from email import message
import json
from pyexpat.errors import messages
import re
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from Chat.models import CommunityChat, FriendsChat, Message, Chat
from Chat.serializers import MessageSerializer
from Communities.models import Community
from channels.layers import get_channel_layer



class ChatConsumer(AsyncWebsocketConsumer):
    #FUNCTION WHEN USER CONNECT
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
        else:
            await self.accept()

        chats = await self.get_user_chats()

        for chat in chats:
            group = chat
            await self.channel_layer.group_add(
                group,
                self.channel_name
            )


    #FUNCTION WHEN USER DISCONNECT
    async def disconnect(self, close_code):
        chats = await self.get_user_chats()
        for chat in chats:
            await self.channel_layer.group_discard(
                chat,
                self.channel_name
            )


    #FUNCTION WHEN RECIVE DATA
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        if text_data_json['type'] == 'message':
            if (text_data_json['replayed']):
                message = await self.create_message(text_data_json['message'], text_data_json['group'], replayed=text_data_json['replayed'])
            else:
                message = await self.create_message(text_data_json['message'], text_data_json['group'])

            await self.channel_layer.group_send(
                text_data_json['group'],
                {
                    'type': 'chat_message',
                    'message': message
                }
            )

        elif text_data_json['type'] == 'newchat':
            await self.channel_layer.group_add(
                text_data_json['group'],
                self.channel_name
            )
        
        elif text_data_json['type'] == 'newcommunity':
            chats = await self.get_community_chats(text_data_json['community'])
            for chat in chats:
                group = chat
                await self.channel_layer.group_add(
                    group,
                    self.channel_name
                )
        
        elif text_data_json['type'] == 'deletemesssage':
            await self.delete_message(text_data_json['id'])
            await self.channel_layer.group_send(
                text_data_json['group'],
                {
                    'type': 'deleted_message',
                    'id': text_data_json['id']
                }
            )
        
        elif text_data_json['type'] == 'editmessage':
            await self.edit_message(id=text_data_json['id'], content=text_data_json['content'])
            await self.channel_layer.group_send(
                text_data_json['group'],
                {
                    'type': 'edited_message',
                    'id': text_data_json['id'],
                    'content': text_data_json['content']
                }
            )


    #FUNCTION TO SEND BROADCAST MESSAGE
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'content': event['message'],
            'type': 'message'
        }))
    

    #FUNCTION TO SEND BROADCAST DELETED MESSAGE
    async def deleted_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'type': 'deletedmessage'
        }))
    

    #FUNCTION TO SEND BROADCAST EDIT MESSAGE
    async def edited_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'content': event['content'],
            'type': 'editedmessage'
        }))


    #API FUNCTION TO CREATE NEW MESSAGE
    @sync_to_async
    def create_message(self, message, chat, replayed=None):
        chat = Chat.objects.get(code=chat)
        message = Message.objects.create(sender=self.scope['user'], content=message, chat=chat)
        if (replayed):
            message_replayed = Message.objects.get(id=replayed)
            message.replayed = message_replayed
            message.save()
        return MessageSerializer(message).data


    #API FUNCTION TO GET USER CHATS
    @sync_to_async
    def get_user_chats(self):
        communities = Community.objects.filter(members__id=self.scope['user'].id)
        chats = []
        for community in communities:
            community_chats = CommunityChat.objects.filter(community=community)
            for chat in community_chats:
                chats.append(chat.code)
        
        friends_chats = FriendsChat.objects.filter(friends__id=self.scope['user'].id)
        for chat in friends_chats:
            chats.append(chat.code)
            
        return chats
    

    #API FUNCTION TO GET COMMUNITY CHATS
    @sync_to_async
    def get_community_chats(self, code):
        community = Community.objects.get(code=code)
        community_chats = CommunityChat.objects.filter(community=community)

        chats = []
        for chat in community_chats:
            chats.append(chat.code)
        
        return chats
    


    #API FUNCTION TO DELETE MESSAGE
    @sync_to_async
    def delete_message(self, id):
        message = Message.objects.get(id=id)
        message.delete()
    

    #API FUNCTION TO EDIT MESSAGE
    @sync_to_async
    def edit_message(self, id, content):
        message = Message.objects.get(id=id)
        message.content = content
        message.edited = True
        message.save()