import json
import re
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Profile
from django.contrib.auth.models import User
from .serializers import UserSerializer
from .authentication import getUserAutenticated
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password



@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def UserProfileApiView(request):
    '''
        API ENDPOINT FOR USER PROFILE MANAGMENT.

        Input for POST/PUT:
            data: {
                    "username": "manolo",
                    "password": "asdASD123",
                    "email": "",
                    "userprofile": {
                        "description": "Esta es la descpripción de manolo",
                        "birthdate": "2022-01-15"
                    }
                }
            image: *image*
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str and request.method != "POST":
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)


    if request.method == 'GET':
        users = User.objects.filter(username__contains=request.query_params.get('username'))
        if users:
            users_profiles = []
            for user in users:
                users_profiles.append(UserSerializer(user).data)
            return Response(users_profiles, status=status.HTTP_200_OK)
        else:
            return Response('User not found', status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "POST":
        data_json = request.data['data']
        user_profile_serializer = UserSerializer(data=data_json)
        if user_profile_serializer.is_valid():
            user_profile_serializer.create(user_profile_serializer.validated_data, password=data_json['password'], image=request.FILES['image'] if request.FILES else None)
            return Response('User created', status=status.HTTP_200_OK)
        return Response(user_profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == "PUT":
        data_json = json.loads(request.data['data'])
        user_profile_serializer = UserSerializer(user_autenticated, data=data_json, partial=True)
        if user_profile_serializer.is_valid():
            user_profile_serializer.update(user_autenticated, user_profile_serializer.validated_data, image=request.FILES['image'] if request.FILES else None)
            user_serializer = UserSerializer(user_autenticated)
            return Response(user_serializer.data, status=status.HTTP_200_OK)
        return Response(user_profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == "DELETE":
        if check_password(request.data['password'], user_autenticated.password):
            user_autenticated.delete()
            return Response('User deleted', status=status.HTTP_200_OK)
        return Response('Incorrect password', status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PUT',])
def ChangePasswordApiView(request):
    '''
        API ENDPOINT FOR CHANGE PASSWORD OF LOGED USER.

        Input for PUT:
            password: "asdASD123"
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == "PUT":
        user_autenticated.password = make_password(request.data['password'])
        user_autenticated.save()
        return Response('User password updated', status=status.HTTP_200_OK)