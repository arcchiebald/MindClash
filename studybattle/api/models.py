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
    grade = models.IntegerField(choices=GRADE_CHOICES, null=True, blank=True, default=None)
    skill_points = models.IntegerField(default=1000)
    number_of_wins = models.IntegerField(default=0)
    ready = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - Student"
    
    @property
    def all_battles(self):
        from django.db.models import Q
        return Battle.objects.filter(Q(student1=self) | Q(student2=self))
    
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
        
class Subject(models.Model):
    name = models.CharField(max_length=100)


    def __str__(self):
        return self.name

class GradeTopic(models.Model):
    GRADE_CHOICES = [(i, f"Class {i}") for i in range(9, 13)]
    grade = models.IntegerField(choices=GRADE_CHOICES)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='grade_topics')
    topics = models.JSONField(default=list, help_text="List of topics for the grade")  # Change to JSONField
    def get_topics_list(self):
        return [topic.strip() for topic in self.topics.split(',')]

    def __str__(self):
        return f"{self.subject.name} - Class {self.grade}"
    
@receiver(post_save, sender=Subject)
def create_grade_topics(sender, instance, created, **kwargs):
    if created:
        for grade in range(9, 13):
            GradeTopic.objects.create(grade=grade, subject=instance, topics="")  # Initialize with empty topics
            

class Battle(models.Model):
    student1 = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='student1_battles')
    student2 = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='student2_battles')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    grade = models.IntegerField(editable=False)  # Grade will be automatically assigned
    topic = models.ForeignKey(GradeTopic, on_delete=models.CASCADE, related_name='battles')
    winner = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True, related_name='won_battles')
    date_created = models.DateTimeField(auto_now_add=True)
    date_completed = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Automatically determine the grade based on the students
        if self.student1.grade != self.student2.grade:
            raise ValueError("Both students must be in the same grade to battle.")
        self.grade = self.student1.grade

        # Ensure the winner is either student1 or student2
        if self.winner and self.winner not in [self.student1, self.student2]:
            raise ValueError("The winner must be either student1 or student2.")

        # Automatically assign a topic based on grade and subject
        grade_topics = GradeTopic.objects.filter(grade=self.grade, subject=self.subject)
        if not grade_topics.exists():
            raise ValueError("No topics available for the given grade and subject.")
        self.topic = grade_topics.first()  # Assign the first available topic

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Battle between {self.student1.user.username} and {self.student2.user.username} ({self.date_created.strftime('%Y-%m-%d %H:%M:%S')})"
    
@receiver(post_save, sender=Battle)
def update_skill_points(sender, instance, **kwargs):
    if instance.date_completed and instance.winner:
        # Ensure both students are part of the battle
        if instance.winner == instance.student1:
            loser = instance.student2
        elif instance.winner == instance.student2:
            loser = instance.student1
        else:
            return  # Invalid state, do nothing

        # Elo rating algorithm
        K = 32  # K-factor
        winner_points = instance.winner.skill_points
        loser_points = loser.skill_points

        expected_winner = 1 / (1 + 10 ** ((loser_points - winner_points) / 400))
        expected_loser = 1 / (1 + 10 ** ((winner_points - loser_points) / 400))

        instance.winner.skill_points += int(K * (1 - expected_winner))
        loser.skill_points += int(K * (0 - expected_loser))

        # Increase number_of_wins for the winner
        instance.winner.number_of_wins += 1

        # Save updated skill points and wins
        instance.winner.save()
        loser.save()

    # Elo rating algorithm for a draw
    if instance.date_completed and instance.winner is None:
        # Ensure both students are part of the battle
        student1 = instance.student1
        student2 = instance.student2

        K = 16  # Reduced K-factor for a draw
        student1_points = student1.skill_points
        student2_points = student2.skill_points

        expected_student1 = 1 / (1 + 10 ** ((student2_points - student1_points) / 400))
        expected_student2 = 1 / (1 + 10 ** ((student1_points - student2_points) / 400))

        student1.skill_points += int(K * (0.5 - expected_student1))
        student2.skill_points += int(K * (0.5 - expected_student2))

        # Save updated skill points
        student1.save()
        student2.save()