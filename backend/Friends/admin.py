from django.contrib import admin
from .models import Friends, FriendshipRequest


class FriendsAdmin(admin.ModelAdmin):
    list = ('__all__')

class FriendshipRequestAdmin(admin.ModelAdmin):
    list = ('__all__')

admin.site.register(Friends, FriendsAdmin)
admin.site.register(FriendshipRequest, FriendshipRequestAdmin)