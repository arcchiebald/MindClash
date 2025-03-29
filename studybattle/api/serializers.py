from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import CustomUser, Subject, GradeTopic, Profile, Student
import datetime 


def age(birthday):
    today = datetime.date.today()
    return today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))


User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', "birthday", 'password', 'password2']

    def validate(self, attrs):
        if age(attrs['birthday']) < 13:
            raise serializers.ValidationError({"birthday": "You must be at least 13 years old to register."})
        
        if attrs['birthday'] > datetime.date.today():
            raise serializers.ValidationError({"birthday": "Birthday cannot be in the future."})
        
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
    
class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        user = authenticate(email=attrs['email'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError({"detail": "Invalid credentials."})
        return {"user": user}

    class Meta:
        model = User
        fields = ['email', 'password']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class GradeTopicSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()  # Nested serializer for subject

    class Meta:
        model = GradeTopic
        fields = ['id', 'grade', 'subject', 'topics']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'location']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['grade', 'skill_points', 'number_of_wins', 'ready']

class CustomUserSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    profile = ProfileSerializer()  # Nested serializer for Profile
    student_profile = StudentSerializer()  # Nested serializer for Student

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'birthday', 'age', 'profile', 'student_profile']

    def get_age(self, obj):
        return age(obj.birthday)
    
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']
        
class GradeTopicSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()  # Nested serializer for subject

    class Meta:
        model = GradeTopic
        fields = ['id', 'grade', 'subject', 'topics']