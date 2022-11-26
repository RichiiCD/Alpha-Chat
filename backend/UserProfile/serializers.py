from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from Friends.models import Friends
from django.contrib.auth.hashers import make_password



class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ('id', 'code', 'description', 'birthdate', 'image')


class UserTokenSerializer(serializers.ModelSerializer):
    userprofile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'userprofile')


class UserSerializer(serializers.ModelSerializer):
    userprofile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'userprofile')
    
    def create(self, validated_data, password, image=None):
        '''
            First create the user by passing the password through a parameter in the create method and the validated data.
            Then it checks whether or not there is an image and creates the user's profile.
        '''
        profile_data = validated_data.pop('userprofile')
        user = User.objects.create(password=make_password(password), **validated_data)
        if image:
            Profile.objects.create(user=user, image=image, **profile_data)
        else:
            Profile.objects.create(user=user, **profile_data)
        Friends.objects.create(user=user)
        return user

    def update(self, instance, validated_data, image=None):
        '''
            Look for the instance of the profile through the logged in user and change the fields with the validated data.
        '''
        profile = Profile.objects.get(user=instance)
        instance.username = validated_data['username']
        instance.email = validated_data['email']
        profile.description = validated_data['userprofile']['description']
        profile.birthdate = validated_data['userprofile']['birthdate']
        if image:
            profile.image = image
        instance.save()
        profile.save() 
        return instance
