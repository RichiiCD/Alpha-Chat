from django.contrib import admin
from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list = ('__all__')


admin.site.register(Profile, ProfileAdmin)
