from rest_framework import serializers
from .models import Friends, FriendshipRequest
from UserProfile.serializers import UserSerializer



class FriendsSerializer(serializers.ModelSerializer):
    friends = UserSerializer(read_only=True, many=True)

    class Meta:
        model = Friends
        fields = ('id', 'user', 'friends')


class FriendshipRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = FriendshipRequest
        fields = ('id', 'receiver')
    
    def create(self, validated_data, sender):
        '''
            Check if users are already friends.
            And then, check if the friend request has already been sent, if it hasn't, create it.
        '''
        if Friends.objects.get(user=sender).friends.filter(id=validated_data['receiver'].id).exists():
            return "Users are already friends"

        if FriendshipRequest.objects.filter(sender=sender).filter(receiver=validated_data['receiver']).exists():
            return "Friendship request already sent"

        return FriendshipRequest.objects.create(sender=sender, **validated_data)


class ProfileFriendshipRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = FriendshipRequest
        fields = ('id', 'sender', 'receiver')