from django.urls import path

from . import views

urlpatterns = [
    path("", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("home", views.home, name="home"),
    path("profile", views.profile, name="profile"),

    # API Routes
    path("users", views.users, name="users"),
    path("users/<str:value>", views.users_sel, name="users_sel"),
    path("chats", views.chats, name="chats"),    
    path("chats/<str:recipient>", views.chat_user, name="chat_user"),
    path("picture/<str:recipient>", views.picture, name="picture")    
]