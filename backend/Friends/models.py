from django.db import models
from django.contrib.auth.models import User



class Friends(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="userfriends")
    friends = models.ManyToManyField(User, blank=True, related_name="friends")

    def __str__(self):
        return str(self.user)


class FriendshipRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friendshipsender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friendshipreceiver")

    def __str__(self):
        return str(self.sender) + " -> " + str(self.receiver)