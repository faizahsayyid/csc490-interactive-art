# serializers.py
from rest_framework import serializers
from .models import Project
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

# Project
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'input_device', 'input_action', 'output_device', 'output_action', 'code']
        read_only_fields = ['id']
        extra_kwargs = {
            'code': {'blank': True, 'read_only': True}
        }

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError as e:
            error_message = str(e)
            raise ValidationError(error_message)