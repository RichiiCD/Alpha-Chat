from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Community, CommunityInvitation
from .serializers import *
from UserProfile.authentication import getUserAutenticated
from chatapp import settings



@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def CommunityApiView(request):
    '''
        API ENDPOINT FOR COMMUNITIES CONFIGURATION MANAGMENT. ONLY FOR THE COMMUNITY ADMIN.

        Input for POST/PUT:
            {
                "code": *************,
                "name": "casa de pepe editada",
                "admin_user": 2,
                "image": *img*
            }
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        communities = Community.objects.filter(members__id=user_autenticated.id)
        communities_serializer = GetCommunitySerializer(communities, many=True)
        return Response(communities_serializer.data, status=status.HTTP_200_OK)
    
    if request.method == "POST":
        json_data = request.data['community']
        communities_serializer = CommunitySerializer(data=json_data)
        if communities_serializer.is_valid():
            if request.FILES:
                new_community = communities_serializer.create(validated_data=communities_serializer.validated_data, image=request.FILES['image'], auth_user=user_autenticated)
            else:
                new_community = communities_serializer.create(validated_data=communities_serializer.validated_data, auth_user=user_autenticated)
            return Response(GetCommunitySerializer(new_community).data, status=status.HTTP_200_OK)
        return Response(communities_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == "PUT":
        community = Community.objects.get(code=request.data['code'])
        community_serializer = CommunitySerializer(instance=community, data=request.data)
        if community_serializer.is_valid():
            if request.FILES:
                update_result = community_serializer.update(community, community_serializer.validated_data, image=request.FILES['image'], auth_user=user_autenticated)
            else:
                update_result = community_serializer.update(community, community_serializer.validated_data, auth_user=user_autenticated)
            if type(update_result) == str:
                return Response(update_result, status=status.HTTP_401_UNAUTHORIZED)
            return Response("Community updated", status=status.HTTP_200_OK)
        return Response(community_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == "DELETE":
        try:
            community = Community.objects.get(code=request.data['code'])
            if community.admin_user == user_autenticated:
                community.delete()
                return Response("Community deleted", status=status.HTTP_200_OK)
            return Response('User not authorized to delete the community')
        except:
            return Response("Community not found", status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT'])
def CommunityMembersApiView(request):
    '''
        API ENDPOINT FOR COMMUNITIES MEMBERS MANAGMENT. ONLY FOR THE COMMUNITY ADMIN.
        
        Input for PUT:
            {
                "code": *************,
                "members": [1]
            }
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        community = Community.objects.get(code=request.query_params.get('code'))
        if community.members.filter(id=user_autenticated.id).exists():
            members_serializer = ProfileCommunityMembersSerializer(community)
            return Response(members_serializer.data, status=status.HTTP_200_OK)
        return Response("User not allowed", status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == "PUT":
        community = Community.objects.get(code=request.data['code'])
        community_serializer = CommunityMembersSerializer(instance=community, data=request.data)
        if community_serializer.is_valid():
            update_result = community_serializer.update(community, community_serializer.validated_data, auth_user=user_autenticated)
            if type(update_result) == str:
                return Response(update_result, status=status.HTTP_401_UNAUTHORIZED)
            return Response('Community members updated', status=status.HTTP_200_OK)
        return Response(community_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'POST', 'DELETE'])
def CommunityInvitationApiView(request):
    '''
        API ENDPOINT FOR COMMUNITIES INVITATIONS.

        Input for POST:
            {
                "sender": 1,
                "receiver": 1,
                "community": 8
            }
            
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        if request.query_params.get('type') == 'community':
            community = Community.objects.get(code=request.query_params.get('code'))
            if (community.admin_user == user_autenticated):
                communities_invitations = CommunityInvitation.objects.filter(community=community)
            else:
                return Response('User not allowed', status=status.HTTP_401_UNAUTHORIZED)
        else:
            communities_invitations = CommunityInvitation.objects.filter(receiver=user_autenticated)
        communities_invitations_serializer = GetCommunityInvitationSerializer(communities_invitations, many=True)
        return Response(communities_invitations_serializer.data, status=status.HTTP_200_OK)
    
    if request.method == "POST":
        community_invitation_serializer = CommunityInvitationSerializer(data=request.data)
        if community_invitation_serializer.is_valid():
            creation_result = community_invitation_serializer.create(community_invitation_serializer.validated_data, auth_user=user_autenticated)
            if type(creation_result) == str:
                return Response(creation_result, status=status.HTTP_401_UNAUTHORIZED)
            return Response("Community invitation created", status=status.HTTP_200_OK)
        return Response(community_invitation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == "DELETE":
        try:
            community_invitation = CommunityInvitation.objects.get(code=request.data['code'])
            if community_invitation.sender == user_autenticated:
                community_invitation.delete()
                return Response("Community invitation deleted", status=status.HTTP_200_OK)
            return Response("Not authorized", status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response("Community invitation not found")



@api_view(['POST'])
def CommunityInvitatioResponseApiView(request):
    '''
        API ENDPOINT FOR COMMUNITIES INVITATIONS ACCPET OR REJECT.

        Input for POST:
            {
                "code": "PIDSpg39mSouHLU",
                "response": "accept"/"reject"
            }
    '''

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "POST":
        try:
            community_invitation = CommunityInvitation.objects.get(code=request.data['code'])
            if community_invitation.receiver == user_autenticated:
                if request.data['response'] == "accept":
                    community_invitation.community.members.add(community_invitation.receiver)
                    community_invitation.delete()
                    return Response(GetCommunitySerializer(community_invitation.community).data, status=status.HTTP_200_OK)
                else:
                    community_invitation.delete()
                    return Response('Community invitation rejected', status=status.HTTP_200_OK)
            return Response("Not authorized", status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response('Community invitation not found', status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
def CommunityLeave(request):

    user_autenticated = getUserAutenticated(request)

    if type(user_autenticated) == str:
        return Response(user_autenticated, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "PUT":
        community = Community.objects.get(code=request.data['code'])
        if community.members.filter(id=user_autenticated.id).exists():
            community.members.remove(user_autenticated)
            return Response("User leaves community", status=status.HTTP_200_OK)
        return Response("User not allowed", status=status.HTTP_401_UNAUTHORIZED)