from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, birthday, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, birthday=birthday, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, birthday, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, username, birthday, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    birthday = models.DateField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'birthday']

    def __str__(self):
        return self.email
    
class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    


    def __str__(self):
        return self.user.email

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    GRADE_CHOICES = [(i, f"Class {i}") for i in range(9, 13)]
    grade = models.IntegerField(choices=GRADE_CHOICES, default=5)
    skill_points = models.IntegerField(default=1000)
    number_of_wins = models.IntegerField(default=0)
    ready = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - Student"
    
@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        instance.profile.bio = 'Default bio'
        instance.profile.save()

@receiver(post_save, sender=CustomUser)
def create_student_profile(sender, instance, created, **kwargs):
    if created:
        Student.objects.create(user=instance)

@receiver(post_save, sender=CustomUser)
def save_student_profile(sender, instance, **kwargs):
    if hasattr(instance, 'student_profile'):
        instance.student_profile.save()
