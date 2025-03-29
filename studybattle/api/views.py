from .serializers import RegisterSerializer, LoginSerializer, CustomUserSerializer, SubjectSerializer, GradeTopicSerializer
from .models import Subject, GradeTopic, CustomUser, Profile, Student, Battle
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
import vertexai
from vertexai.preview.generative_models import GenerativeModel
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone



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
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class GetUserView(APIView):
    permission_classes = [IsAuthenticated]

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

class LeaderboardView(APIView):
    def get(self, request):
        top_students = Student.objects.order_by('-skill_points')[:10]
        leaderboard = [
            {
                "username": student.user.username,
                "skill_points": student.skill_points,
                "number_of_wins": student.number_of_wins
            }
            for student in top_students
        ]
        return Response(leaderboard, status=status.HTTP_200_OK)


class BattleView(ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def initiate_battle(self, request):
        # Set the current user as ready
        student = request.user.student_profile
        student.ready = True
        student.save()

        # Get the subject
        subject_id = request.data.get('subject_id')
        subject = Subject.objects.get(id=subject_id)

        # Fetch topics for the grade and subject
        grade_topic = GradeTopic.objects.filter(grade=student.grade, subject=subject).first()
        if not grade_topic:
            return Response({"detail": "No topics available for the given grade and subject."}, status=status.HTTP_404_NOT_FOUND)

        topics = grade_topic.topics

        # Create a Battle instance with a bot
        bot_user = CustomUser.objects.get(id=2)
        bot_student = bot_user.student_profile
        battle = Battle.objects.create(
            student1=student,
            student2=bot_student,
            subject=subject
        )

        # Generate questions using Vertex AI API
        vertexai.init(project="mindclash-455211", location="us-central1")
        model = GenerativeModel("gemini-pro")
        prompt = f"I want you to send me only raw input, because i am going to fetch it, so answer me only in this format: (#number_of_question. question \n) . Please, separate questions with \n. Generate 10 questions for grade {student.grade} on the subject {subject.name} on those topics: {', '.join(topics)}. Assume user should answer with keyboard input only (string,integer). Only questions, no explanations. Do not include any other text or formatting. Example: 1. What is the capital of France? \n 2. What is 2 + 2? \n"
        response = model.generate_content(prompt)
        print(prompt)
        print(response)
        questions = response.text.split('\n')[:10]

        # Store questions in the session for tracking
        request.session[f"battle_{battle.id}_questions"] = questions
        request.session[f"battle_{battle.id}_current_question"] = 0
        request.session[f"battle_{battle.id}_player1_answers"] = []
        request.session[f"battle_{battle.id}_bot_scores"] = []

        # Mark the user as not ready
        student.ready = False
        student.save()

        return Response({"battle_id": battle.id, "first_question": questions[0]}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def submit_answer(self, request, pk=None):
        bot_user = CustomUser.objects.get(id=2)  # Retrieve the bot user
        bot_student = bot_user.student_profile  # Retrieve the bot student profile
        battle = Battle.objects.get(id=pk)
        current_question = request.session.get(f"battle_{pk}_current_question", 0)
        questions = request.session.get(f"battle_{pk}_questions", [])

        if len(request.session.get(f"battle_{pk}_player1_answers", [])) >= len(questions):
            return Response({"detail": "All questions have been answered."}, status=status.HTTP_400_BAD_REQUEST)

        # Log the answer
        answer = request.data.get('answer')
        if f"battle_{pk}_player1_answers" not in request.session:
            request.session[f"battle_{pk}_player1_answers"] = []
        request.session[f"battle_{pk}_player1_answers"].append(answer)

        # Retrieve the current question
        question = questions[current_question]

        # Use Vertex AI API to grade the answer
        vertexai.init(project="mindclash-455211", location="us-central1")
        model =  GenerativeModel("gemini-pro")
        grading_prompt = f"I am web app and I want only raw answer from you. Evaluate the following answer for the question: '{question}' -> Answer: [{answer}]. Provide a score of 1 if the answer is correct, otherwise 0. Only return the score as an integer. Example: 0 or 1. Do not include any other text or formatting."
        grading_response = model.generate_content(grading_prompt)


        # Validate the response and handle invalid cases
        try:
            player1_score = int(grading_response.text.strip())
        except (ValueError, TypeError):
            # Log the invalid response for debugging purposes
            print(f"Invalid AI response: {grading_response.text.strip()}")
            player1_score = 0  # Default to 0 if the response is not a valid integer

        # Add the score to the total player1 score
        request.session[f"battle_{pk}_bot_scores"].append(player1_score)

        # Move to the next question
        request.session[f"battle_{pk}_current_question"] += 1

        if request.session[f"battle_{pk}_current_question"] >= len(questions):
            # Calculate total scores and determine the winner
            player1_total_score = sum(request.session[f"battle_{pk}_bot_scores"])

            # Generate a random bot score for the entire battle
            import random
            bot_total_score = random.randint(1, 6)

            if player1_total_score > bot_total_score:
                winner = request.user.username
            elif bot_total_score > player1_total_score:
                winner = bot_student.user.username
            else:
                winner = "draw"  # TODO: Implement draw logic here

            # Update the battle instance
            if winner == "draw":
                battle.winner = None
            elif winner == request.user.username:
                battle.winner = request.user.student_profile
            else:
                battle.winner = bot_student

            battle.date_completed = timezone.now()
            battle.save()

            # Clear session data for the battle
            del request.session[f"battle_{pk}_questions"]
            del request.session[f"battle_{pk}_current_question"]
            del request.session[f"battle_{pk}_player1_answers"]
            del request.session[f"battle_{pk}_bot_scores"]

            return Response({
                "winner": winner,
                "player1_total_score": player1_total_score,
                "bot_total_score": bot_total_score
            }, status=status.HTTP_200_OK)

        return Response({"next_question": questions[request.session[f"battle_{pk}_current_question"]]}, status=status.HTTP_200_OK)



