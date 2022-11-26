from django.db import models
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.db import transaction
from django.db import models
from Communities.models import generate_random_code



class Profile(models.Model):
    code = models.CharField(max_length=8, unique=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="userprofile")
    description = models.CharField(max_length=100, blank=True, null=True)
    birthdate = models.DateField()
    image = models.ImageField(upload_to="media", default="media/defaultcommunity.png")

    def __str__(self):
        return str(self.user) + " / " + str(self.code)
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = generate_random_code(8)
        success = False
        while not success:
            try:
                with transaction.atomic():
                    super(Profile, self).save(*args, **kwargs)
            except IntegrityError:
                self.code = generate_random_code(8)
            else:
                success = True