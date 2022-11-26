from rest_framework import serializers
from .models import Chat, Message, CommunityChat, FriendsChat
from UserProfile.serializers import UserSerializer



class ChatSerializer(serializers.ModelSerializer):

    class Meta:
        model = Chat
        fields = ('__all__')


class CommunityChatSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommunityChat
        fields = ('__all__')


class GetFriendsChatSerializer(serializers.ModelSerializer):
    friends = UserSerializer(read_only=True, many=True)

    class Meta:
        model = FriendsChat
        fields = ('__all__')


class FriendsChatSerializer(serializers.ModelSerializer):

    class Meta:
        model = FriendsChat
        fields = ('__all__')

    def create(self, validated_data, auth_user):
        friends_chat = FriendsChat.objects.create(type="friends")
        friends_chat.friends.add(validated_data['friends'][0].id)
        friends_chat.friends.add(auth_user)

        return friends_chat
        

class ReplayedMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()

    class Meta:
        model = Message
        fields = ('id', 'content', 'sender')


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    chat = ChatSerializer()
    replayed = ReplayedMessageSerializer()

    class Meta:
        model = Message
        fields = ('__all__')