from rest_framework import serializers
from .models import Project, InputDevice, OutputDevice, Interaction


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ("id", "last_modified", "owner")


class InputOutputDeviceInputSerializer(serializers.Serializer):
    input_device = serializers.CharField(required=False, allow_null=True)
    output_device = serializers.CharField()


class ParamsFromActionSerializer(serializers.Serializer):
    action_key = serializers.CharField()


class InputDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = InputDevice
        fields = "__all__"


class OutputDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutputDevice
        fields = "__all__"


class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    input_devices = InputDeviceSerializer(many=True)
    output_devices = OutputDeviceSerializer(many=True)
    interactions = InteractionSerializer(many=True)

    class Meta:
        model = Project
        fields = "__all__"

    def create(self, validated_data):
        input_devices_data = validated_data.pop("input_devices")
        output_devices_data = validated_data.pop("output_devices")
        interactions_data = validated_data.pop("interactions")
        project = Project.objects.create(**validated_data)

        for input_device_data in input_devices_data:
            InputDevice.objects.create(project=project, **input_device_data)

        for output_device_data in output_devices_data:
            OutputDevice.objects.create(project=project, **output_device_data)

        for interaction_data in interactions_data:
            Interaction.objects.create(project=project, **interaction_data)

        return project
