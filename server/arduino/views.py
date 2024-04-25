from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from .utils.ino_code_ds import inoCodeDataStructure
from django.views import View
from django.contrib.auth.decorators import login_required
from .models import Project, InputDevice, OutputDevice, Interaction
from .serializers import ProjectSerializer, InputOutputDeviceInputSerializer, ParamsFromActionSerializer
from .utils.actions import Actions
from .serializers import ProjectSerializer, InputDeviceSerializer, OutputDeviceSerializer, InteractionSerializer

PYTHON_TO_TS_ACTION_TYPE_MAP = {"int": "number", "bool": "boolean"}


@method_decorator(csrf_exempt, name="dispatch")
class SendCodeToBoard(APIView):
    def post(self, request, *args, **kwargs):
        try:
            print(request.data)
            code = inoCodeDataStructure()
            # Data is a list of lists of form: [input_pin: Optional[int], output_pins: List[int], action: str, *args: list]
            # Each list represents some connection between device (solo output, or input -> output(s))
            project_id = request.data.get("project_id")
            project = Project.objects.get(id=project_id)
            # Assume project has been created with all required information
            for interaction in Interaction.objects.filter(project=project):

                # Assuming input and output devices are already assigned with their pins
                input_pin = interaction.input_device.pin
                output_pins = [interaction.output_device.pin]
                # if multiple op devices are allowed: output_pins = [output_device.pin for output_device in interaction.output_devices.all()]
                action_str = interaction.action
                arguments = interaction.additional_variables

                if not (isinstance(input_pin, int) or input_pin is None):
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "input_pin must be an integer or None."})
                if not isinstance(output_pins, list) or not all(isinstance(x, int) for x in output_pins):
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "output_pins must be a list of integers."})
                if not isinstance(action_str, str):
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "action must be a string."})
                if not isinstance(arguments, list):
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "arguments must be a list."})
                
                # Initialize the connection between the input and output devices
                code.initialize_new_device_connection(input_pin, output_pins, action_str, arguments)

            try:    
                code.upload()
            except Exception as e:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "Failed to upload code to board.", "code": str(code), "Error": str(e)})
            return Response(status=status.HTTP_200_OK, data={"code": str(code)})
        except AssertionError as ae:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "Assertion error: " + str(ae)})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": str(e)})


@method_decorator(csrf_exempt, name="dispatch")
class CreateProject(APIView):
    """
    @TODO faizah, correct with whatever you decide
    Create a new project with input and output devices
    """

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            project_name = data.get("name")
            owner = request.user
            
            # @TODO revert back to required version
            if owner.is_anonymous:
                owner = None
                
            input_devices = data.get("input_devices", [])
            output_devices = data.get("output_devices", [])

            project = Project.objects.create(name=project_name, owner=owner)

            for device_name in input_devices:
                for _ in range(input_devices[device_name]):
                    InputDevice.objects.create(project=project, device_name=device_name)

            for device_name in output_devices:
                for _ in range(output_devices[device_name]):
                    OutputDevice.objects.create(project=project, device_name=device_name)

            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})


@method_decorator(csrf_exempt, name="dispatch")
class GetActionsForDevices(APIView):
    def post(self, request, *args, **kwargs):
        serializer = InputOutputDeviceInputSerializer(data=request.data)
        if serializer.is_valid():
            input_device = serializer.validated_data.get("input_device")
            output_device = serializer.validated_data.get("output_device")
            actions = Actions()

            actions_list = actions.get_allowed_actions_for_input_output_combo(output_device, input_device)

            return Response(actions_list, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class GetRequiredAdditionalParamsForActions(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ParamsFromActionSerializer(data=request.data)
        if serializer.is_valid():
            action_key = serializer.validated_data.get("action_key")
            actions = Actions()

            params: dict = actions.get_arg_list_for_action(action_key)
            params = {k: PYTHON_TO_TS_ACTION_TYPE_MAP[v.__name__] for k, v in params.items()}
            if "input_pin" in params:
                params.pop("input_pin")
            if "output_pin" in params:
                params.pop("output_pin")

            return Response(params, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class Demo(APIView):
    def post(self, request, *args, **kwargs):
        try:
            code = inoCodeDataStructure()
            # TODO: Add demo code here, not on my machine
            code.upload()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(login_required, name="dispatch")
class ProjectListView(View):
    def get(self, request):
        """
        Get a list of all projects owned by the user
        """
        try:
            projects = Project.objects.filter(owner=request.user)
            serializer = ProjectSerializer(projects, many=True)
            return JsonResponse(serializer.data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def post(self, request):
        """
        Create a new project
        """
        try:
            # Get data from request body
            data = json.loads(request.body)
            project_name = data.get("project_name", None)
            if not project_name:
                return JsonResponse({"error": "Project name is required"}, status=400)

            # Check if project with the same name already exists
            if Project.objects.filter(project_name=project_name, owner=request.user).exists():
                return JsonResponse({"error": "Project with this name already exists"}, status=400)

            # Create new project
            project = Project.objects.create(owner=request.user, project_name=project_name)
            # Serialize the updated list
            serializer = ProjectSerializer(Project.objects.filter(owner=request.user), many=True)
            return JsonResponse(serializer.data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# EndPoint: /project/<project_id>
class ProjectDetailView(View):
    def get(self, request, project_id):
        """
        Get details of a specific project
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            serializer = ProjectSerializer(project)
            return JsonResponse(serializer.data)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)

    def delete(self, request, project_id):
        """
        Delete a project
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            project.delete()
            return JsonResponse({"success": True, "message": "Project deleted successfully"})
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def put(self, request, project_id):
        """
        Update a project
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            data = json.loads(request.body)

            # if the user is trying to edit the project name
            if "project_name" in data:
                project_name = data.get("project_name", None)
                if not project_name:
                    return JsonResponse({"error": "Project name is required"}, status=400)
                project.project_name = project_name
            # TODO: Add more fields to update
            if "connections" in data:
                connections = data.get("connections", None)
                if not connections:
                    return JsonResponse({"error": "Connections are required"}, status=400)
                project.connections = connections
            project.save()
            serializer = ProjectSerializer(project)
            return JsonResponse(serializer.data)

        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
