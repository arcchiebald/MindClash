from django.urls import path
from . import views

urlpatterns = [
    # Placeholder for API routes
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.GetUserView.as_view(), name='get_user'),
    path('subjects/', views.SubjectListView.as_view(), name='subject_list'),
    path('topics/', views.GradeTopicListView.as_view(), name='grade_topic_list'),
]