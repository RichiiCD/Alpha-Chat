from django.contrib import admin
from .models import Community, CommunityInvitation


class CommunityAdmin(admin.ModelAdmin):
    list = ('__all__')

class CommunityInvitationAdmin(admin.ModelAdmin):
    list = ('__all__')


admin.site.register(Community, CommunityAdmin)
admin.site.register(CommunityInvitation, CommunityInvitationAdmin)