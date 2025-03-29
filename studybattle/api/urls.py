from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import LeaderboardView, BattleView

router = DefaultRouter()
router.register(r'battle', BattleView, basename='battle')

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.GetUserView.as_view(), name='get_user'),
    path('subjects/', views.SubjectListView.as_view(), name='subject_list'),
    path('topics/', views.GradeTopicListView.as_view(), name='grade_topic_list'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('', include(router.urls)),  # Include the router-generated routes
]