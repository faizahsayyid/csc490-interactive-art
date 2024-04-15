from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('id', 'last_modified', 'owner')
        
class InputOutputDeviceInputSerializer(serializers.Serializer):
    input_device = serializers.CharField(required=False, allow_null=True)
    output_device = serializers.CharField()
    
class ParamsFromActionSerializer(serializers.Serializer):
    action_key = serializers.CharField()
    