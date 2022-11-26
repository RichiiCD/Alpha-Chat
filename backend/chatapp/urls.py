"""chatapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from Communities.views import *
from UserProfile.authentication import Login, Logout
from UserProfile.views import *
from Friends.views import *
from Chat.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', Login.as_view(), name="Login"),
    path('api/logout/', Logout.as_view(), name="Logout"),
    path('api/community/', CommunityApiView),
    path('api/community/leave/', CommunityLeave),
    path('api/community/members/', CommunityMembersApiView),
    path('api/community/invitations/', CommunityInvitationApiView),
    path('api/community/invitations/response/', CommunityInvitatioResponseApiView),
    path('api/user/profile/', UserProfileApiView),
    path('api/user/changepassword/', ChangePasswordApiView),
    path('api/user/friends/', FriendsApiView),
    path('api/user/friends/request/', FriendshipRequestApiView),
    path('api/user/friends/request/response/', FriendshipRequestResponseApiView),
    path('api/community/chat/', ChatApiView),
    path('api/community/chat/messages/', ChatMessagesApiView)
] 

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
