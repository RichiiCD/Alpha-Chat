from django.db import IntegrityError
from django.db import transaction
from django.db import models
from django.contrib.auth.models import User
import random
import string



def generate_random_code(num_chars):
    allowed_chars = ''.join((string.ascii_letters, string.digits))
    return ''.join(random.choice(allowed_chars) for _ in range(num_chars))



class Community(models.Model):
    code = models.CharField(max_length=20, unique=True, editable=False)
    name = models.CharField(max_length=40)
    image = models.ImageField(upload_to="media", default="media/defaultcommunity.png")
    creation_date = models.DateField(auto_now_add=True)
    admin_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="admin_user")
    members = models.ManyToManyField(User, related_name="members")

    def __str__(self, *args, **kwargs):
        return self.code

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = generate_random_code(20)
        success = False
        while not success:
            try:
                with transaction.atomic():
                    super(Community, self).save(*args, **kwargs)
            except IntegrityError:
                self.code = generate_random_code(20)
            else:
                success = True



class CommunityInvitation(models.Model):
    code = models.CharField(max_length=15, unique=True, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reciver")
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name="community")

    def __str__(self, *args, **kwargs):
        return self.code

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = generate_random_code(15)
        success = False
        while not success:
            try:
                with transaction.atomic():
                    super(CommunityInvitation, self).save(*args, **kwargs)
            except IntegrityError:
                self.code = generate_random_code(15)
            else:
                success = True
