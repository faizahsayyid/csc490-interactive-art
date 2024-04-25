from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth import logout as auth_logout
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.shortcuts import render, redirect
from django.contrib import messages
from .serializers import UserSerializer, RegisterSerializer, LoginUserSerializer, LogoutUserSerializer
from rest_framework.authtoken.models import Token
from knox.models import AuthToken
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

# This is the module for account related features -- registeration, login, logout, delete, edit, etc.


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response({"user": UserSerializer(user, context=self.get_serializer_context()).data, "token": AuthToken.objects.create(user)[1]})


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data
            login(request, user)
            return Response({"user": UserSerializer(user, context=self.get_serializer_context()).data, "token": AuthToken.objects.create(user)[1]})
        return Response({"error": "Invalid data"}, status=400)


class LogoutAPI(generics.GenericAPIView):
    serializer_class = LogoutUserSerializer
    # permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({"status": "Logged out"})


# This is the view for registeration(creating a new account)
class Register(APIView):
    @method_decorator(csrf_exempt)
    def post(self, request):
        data = json.loads(request.body)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            login(request, user)
            return JsonResponse({"message": "Account created successfully", "access": token.key}, status=201)
        return JsonResponse(serializer.errors, status=400)


# This is the view for login
class Login(APIView):
    @method_decorator(csrf_exempt)
    def post(self, request):
        data = json.loads(request.body)
        user = authenticate(username=data["username"], password=data["password"])
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            login(request, user)
            return JsonResponse({"message": "Login successful", "access": token.key, "username": data["username"]}, status=200)
        return JsonResponse({"message": "Invalid credentials"}, status=400)


# This is the view for logout
class Logout(APIView):
    @method_decorator(csrf_exempt)
    def post(self, request):
        if request.user.is_anonymous:
            return JsonResponse({"message": "You are not logged in"}, status=200)
        request.user.auth_token.delete()
        logout(request)
        return JsonResponse({"message": "Logout successful"}, status=200)


# This is the view for editing an account
class EditAccount(APIView):
    @method_decorator(csrf_exempt)
    def put(self, request):
        data = json.loads(request.body)
        user = request.user
        serializer = UserSerializer(user, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "Account updated successfully"}, status=200)
        return JsonResponse(serializer.errors, status=400)


# This is the view for deleting an account
class DeleteAccount(APIView):
    @method_decorator(csrf_exempt)
    def delete(self, request):
        user = request.user
        user.delete()
        return JsonResponse({"message": "Account deleted successfully"}, status=200)
