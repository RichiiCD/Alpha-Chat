from pydoc import describe
from statistics import mode
from tkinter.tix import Tree
from turtle import ondrag
from django.db import models
from django.db import IntegrityError
from django.db import transaction
from django.contrib.auth.models import User
from Communities.models import Community, generate_random_code
from django.contrib.auth.models import User



class Chat(models.Model):
    code = models.CharField(max_length=30, unique=True, editable=False)
    type = models.CharField(max_length=10, default='community')

    def __str__(self):
        return str(self.type) + " - " + str(self.code)
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = generate_random_code(30)
        success = False
        while not success:
            try:
                with transaction.atomic():
                    super(Chat, self).save(*args, **kwargs)
            except IntegrityError:
                self.code = generate_random_code(30)
            else:
                success = True


class CommunityChat(Chat):
    name = models.CharField(max_length=50, default='Welcome chat')
    description = models.CharField(max_length=100, default='', null=True, blank=True)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name="chatcommunity")


class FriendsChat(Chat):
    friends = models.ManyToManyField(User, related_name="chatfriends")


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messagesender")
    content = models.TextField()
    datetime = models.DateTimeField(auto_now_add=True)
    replayed = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name="messagereplayed")
    edited = models.BooleanField(default=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messagechat")

    def __str__(self):
        return str(self.sender) + " - " + str(self.datetime)