from rest_framework import serializers
from .utils.action import InputAction, OutputAction
from .views import INPUT_ACTIONS_CHOICES, OUTPUT_ACTIONS_CHOICES, AFTER_ACTIONS_CHOICES

class InputActionSerializer(serializers.Serializer):
    action = serializers.CharField(required=True, allow_blank=False)
    pin = serializers.IntegerField(required=False)
    duration = serializers.IntegerField(required=False)
    input_reading_delay = serializers.IntegerField(required=False)
    debounce_delay = serializers.IntegerField(required=False)

    def validate_action(self, value):
        if value not in INPUT_ACTIONS_CHOICES:
            raise serializers.ValidationError("Invalid input action")
        return value

    def validate_pin(self, value):
        if value is not None and (value < 2 or value > 13):
            raise serializers.ValidationError("Invalid pin number. Please specify an integer between 0 and 13")
        return value

    def validate_duration(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Invalid duration. Please specify an integer greater than 0")
        return value

    def validate_input_reading_delay(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Invalid input reading delay. Please specify an integer greater than 0")
        return value

    def validate_debounce_delay(self, value):
        if value is not None and self.initial_data.get('action') == 'DOUBLE_TRIGGERED' and value <= 0:
            raise serializers.ValidationError("Invalid debounce delay. Please specify an integer greater than 0")
        return value

    def create(self, validated_data):
        input_action = InputAction(validated_data['action'])
        if 'pin' in validated_data:
            input_action.set_pin(validated_data['pin'])
        if 'duration' in validated_data:
            input_action.set_duration(validated_data['duration'])
        if 'input_reading_delay' in validated_data:
            input_action.set_input_reading_delay(validated_data['input_reading_delay'])
        if 'debounce_delay' in validated_data:
            input_action.set_debounce_delay(validated_data['debounce_delay'])
        return input_action

class OutputActionSerializer(serializers.Serializer):
    action = serializers.CharField(required=True, allow_blank=False)
    after_action = serializers.CharField(required=False)
    pin = serializers.IntegerField(required=False)
    duration = serializers.IntegerField(required=False)
    on_duration = serializers.IntegerField(required=False)
    off_duration = serializers.IntegerField(required=False)

    def validate_action(self, value):
        if value not in OUTPUT_ACTIONS_CHOICES:
            raise serializers.ValidationError("Invalid output action")
        return value

    def validate_after_action(self, value):
        if value is not None and value not in AFTER_ACTIONS_CHOICES:
            raise serializers.ValidationError("Invalid after action")
        return value

    def validate_pin(self, value):
        if value is not None and (value < 2 or value > 13):
            raise serializers.ValidationError("Invalid pin number. Please specify an integer between 0 and 13")
        return value

    def validate_duration(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Invalid duration. Please specify an integer greater than 0")
        return value

    def validate_on_duration(self, value):
        if self.action == 'BLINK':
            if value is not None and value <= 0:
                raise serializers.ValidationError("Invalid on duration. Please specify an integer greater than 0")
        return value

    def validate_off_duration(self, value):
        if self.action == 'BLINK':
            if value is not None and value <= 0:
                raise serializers.ValidationError("Invalid off duration. Please specify an integer greater than 0")
        return value

    def create(self, validated_data):
        if 'after_action' in validated_data:
            output_action = OutputAction(validated_data['action'], validated_data['after_action'])
        else:
            output_action = OutputAction(validated_data['action'])
        if 'pin' in validated_data:
            output_action.set_pin(validated_data['pin'])
        if 'duration' in validated_data:
            output_action.set_duration(validated_data['duration'])
        if 'on_duration' in validated_data:
            output_action.set_on_duration(validated_data['on_duration'])
        if 'off_duration' in validated_data:
            output_action.set_off_duration(validated_data['off_duration'])
        return output_action