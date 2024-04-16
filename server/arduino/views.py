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
from .models import Project
from .serializers import ProjectSerializer, InputOutputDeviceInputSerializer, ParamsFromActionSerializer
from .utils.actions import Actions

PYTHON_TO_TS_ACTION_TYPE_MAP = {"int": "number", "bool": "boolean"}


@method_decorator(csrf_exempt, name="dispatch")
class SendCodeToBoard(APIView):
    def post(self, request, *args, **kwargs):
        try:
            code = inoCodeDataStructure()
            # Data is a list of lists of form: [input_pin: Optional[int], output_pins: List[int], action: str, *args, **kwargs]
            # Each list represents some connection between device (solo output, or input -> output(s))
            data = request.data
            assert isinstance(data, list) and all(isinstance(x, list) for x in data)
            for connection in data:
                input_pin = connection[0]
                output_pins = connection[1]
                action_str = connection[2]
                arguments = connection[3:]
                assert isinstance(input_pin, int) or input_pin is None
                assert isinstance(output_pins, list) and all(isinstance(x, int) for x in output_pins)
                assert isinstance(action_str, str)
                assert isinstance(args, list)

                # Initialize the connection between the input and output devices
                code.initialize_new_device_connection(input_pin, output_pins, action_str, arguments)
            code.upload()
            return Response(status=status.HTTP_200_OK)
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
