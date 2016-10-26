from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class LifeGoal(models.Model):
    owner = models.ForeignKey(User, on_delete = models.CASCADE, null = True)
    name = models.CharField(max_length = 30, null = True)
    end_date = models.DateTimeField(null = True)
    brief_description = models.TextField(null = True)
    rest_description = models.TextField(null = True)
    completed = models.BooleanField(default=False)