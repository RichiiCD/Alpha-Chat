from django.dispatch import receiver
from rest_framework import serializers
from .models import Community, CommunityInvitation
from Chat.models import CommunityChat
from UserProfile.serializers import UserSerializer



class GetCommunitySerializer(serializers.ModelSerializer):
    admin_user = UserSerializer(read_only=True)

    class Meta:
        model = Community
        fields = ('id', 'code', 'name', 'image', 'admin_user')



class CommunitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Community
        fields = ('code', 'name', 'image')
    
    def create(self, validated_data, auth_user, image=None):
        '''
            It is checked whether the user has entered an image or not and the model instance is created with the validated data.
        '''
        if image:
            community = Community.objects.create(image=image, name=validated_data['name'], admin_user=auth_user)
        else:
            community = Community.objects.create(name=validated_data['name'], admin_user=auth_user)
        community.members.set([auth_user])
        default_chat = CommunityChat.objects.create(name='Welcome chat', description='Welcome to the community', community=community)
        default_chat.save()

        return community
    
    def update(self, instance, validated_data, auth_user, image=None):
        '''
            Checks if the user who sent the update request is the community administrator through the authenticated user.
            Then, it is checked whether the user has entered an image or not and the fields are updated with the validated data.
        '''
        if instance.admin_user == auth_user:
            if image:
                instance.image = image
            instance.name = validated_data['name']
            
            instance.save()
            return instance
        return "User not allowed to edit community"



class CommunityMembersSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Community
        fields = ('code', 'members')
    
    def update(self, instance, validated_data, auth_user):
        '''
           Checks if the user who sent the update request is the community administrator through the authenticated user.
           If the user is, delete it. If not, add it.
        '''
        if instance.admin_user == auth_user:
            for member in validated_data['members']:
                if instance.members.filter(id=member.id).exists():
                    instance.members.remove(member)
                else:
                    instance.members.add(member)
            return instance.save()
        else:
            return "User not allowed to edit community members"



class ProfileCommunityMembersSerializer(serializers.ModelSerializer):
    members = UserSerializer(read_only=True, many=True)

    class Meta:
        model = Community
        fields = ('code', 'members')



class GetCommunityInvitationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    community = CommunitySerializer(read_only=True)

    class Meta:
        model = CommunityInvitation
        fields = ('__all__')



class CommunityInvitationSerializer(serializers.ModelSerializer):
    '''
        Checks if the user who sent the invitation request is the community administrator through the authenticated user.
        Then it checks if the user is already in the group.
        If so, the request is rejected. If not, the invitation is created.
    '''

    class Meta:
        model = CommunityInvitation
        fields = ('__all__')
    
    def create(self, validated_data, auth_user):
        if validated_data['community'].admin_user == auth_user:
            if validated_data['community'].members.filter(id=validated_data['receiver'].id).exists():
                return "This user is already in the community"
            community = CommunityInvitation.objects.create(sender=auth_user, receiver=validated_data['receiver'], community=validated_data['community'])
            return community
        else:
            return "User not allowed to create invitation"

