from django.contrib import admin
from .models import Chat, Message, CommunityChat, FriendsChat


class ChatAdmin(admin.ModelAdmin):
    list = ('__all__')

class CommunityChatAdmin(admin.ModelAdmin):
    list = ('__all__')

class FriendsChatAdmin(admin.ModelAdmin):
    list = ('__all__')

class MessageAdmin(admin.ModelAdmin):
    list = ('__all__')


admin.site.register(Chat, ChatAdmin)
admin.site.register(CommunityChat, CommunityChatAdmin)
admin.site.register(FriendsChat, FriendsChatAdmin)
admin.site.register(Message, MessageAdmin)