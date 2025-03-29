from django.shortcuts import render
from .serializers import RegisterSerializer, LoginSerializer, CustomUserSerializer, SubjectSerializer, GradeTopicSerializer
from .models import Subject, GradeTopic, CustomUser, Profile, Student
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
import vertexai
from vertexai.language_models import TextGenerationModel
from django.http import JsonResponse


# Create your views here.

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    
class GetUserView(APIView):
    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SubjectListView(APIView):
    def get(self, request):
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GradeTopicListView(APIView):
    def get(self, request):
        grade_topics = GradeTopic.objects.all()
        serializer = GradeTopicSerializer(grade_topics, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class QuizGenerationView(APIView):
    def post(self, request):
        """Generate a quiz question and answer using Google's Gemini model."""
        vertexai.init(project="mindclash-455211", location="us-central1")
        prompt = "Generate a multiple-choice question for high school physics with four options and the correct answer."
        
        model = TextGenerationModel.from_pretrained("gemini-pro")
        response = model.predict(prompt, max_output_tokens=200)
        
        return JsonResponse({"question": response.text})
