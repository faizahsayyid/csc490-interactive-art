# from .models import Profile
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'id': {'read_only': True}, # This is to prevent the user from changing their id
            'username': {'read_only': True}, # This is to prevent the user from changing their username
            'email': {'required': False}, # This is to make the email field not required
            'password': {'write_only': True}, # This is to make the password field not visible
            'first_name': {'required': False}, # This is to make the first name field not required
            'last_name': {'required': False}, # This is to make the last name field not required
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        if validated_data.get('email'):
            instance.email = validated_data['email']
        if validated_data.get('first_name'):
            instance.first_name = validated_data['first_name']
        if validated_data.get('last_name'):
            instance.last_name = validated_data['last_name']
        if validated_data.get('password'):
            instance.set_password(validated_data['password'])
        instance.save()
        return instance
    
    def validate(self, data):
        if not data.get('username'):
            raise serializers.ValidationError('You must provide username')
        return data
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already exists')
        return value
    
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters long')
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already exists')
        return value
    