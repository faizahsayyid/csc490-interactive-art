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
                return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": f"Failed to upload code to board.\ncode: {str(code)}\nError:{str(e)}"})
            return Response(status=status.HTTP_200_OK, data={"code": str(code)})
        except AssertionError as ae:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "Assertion error: " + str(ae)})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": str(e)})

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
            project_name = data.get("name", None)
            if not project_name:
                return JsonResponse({"error": "Project name is required"}, status=400)

            # Check if project with the same name already exists
            if Project.objects.filter(name=project_name, owner=request.user).exists():
                return JsonResponse({"error": "Project with this name already exists"}, status=400)

            # Create new project
            project = Project.objects.create(owner=request.user, name=project_name)
            if "input_devices" in data:
                input_devices = data.get("input_devices", [])
                for device in input_devices:
                    InputDevice.objects.create(project=project, **device)

            if "output_devices" in data:
                output_devices = data.get("output_devices", [])
                for device in output_devices:
                    OutputDevice.objects.create(project=project, **device)
                
            # Serialize the updated list
            serializer = ProjectSerializer(project)
            return JsonResponse(serializer.data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# EndPoint: /project/<project_id>
@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(login_required, name="dispatch")
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
            if "name" in data:
                project_name = data.get("name", None)
                if not project_name:
                    return JsonResponse({"error": "Project name is required"}, status=400)
                project.name = project_name
                project.save()

            # if the user is trying to edit the input devices
            if "input_devices" in data:
                input_devices = data.get("input_devices", [])
                for device in input_devices:
                    device_id = device.get("id")
                    existing_device = project.input_devices.filter(id=device_id).first()
                    if "id" in device and existing_device:
                        existing_device.pin = device.get("pin", existing_device.pin)
                        existing_device.save()
                    else:
                        if "id" in device:
                            device.pop("id")
                        InputDevice.objects.create(project=project, **device)
            
            # if the user is trying to edit the output devices
            if "output_devices" in data:
                output_devices = data.get("output_devices", [])
                for device in output_devices:
                    device_id = device.get("id")
                    existing_device = project.output_devices.filter(id=device_id).first()
                    if "id" in device and existing_device:
                        existing_device.pin = device.get("pin", existing_device.pin)
                        existing_device.save()
                    else:
                        if "id" in device:
                            device.pop("id")
                        OutputDevice.objects.create(project=project, **device)

            # if the user is trying to edit the interactions
            if "interactions" in data:
                interactions = data.get("interactions", [])
                for interaction in interactions:

                    # check if input_device exists in database
                    input_device_id = interaction.get("input_device", None)
                    input_device = InputDevice.objects.get(id=input_device_id)
                    if not input_device:
                        return JsonResponse({"error": f"Input device with id {input_device_id} does not exist"}, status=400)
                    
                    # check if output_device exists in database
                    output_device_id = interaction.get("output_device", None)
                    output_device = OutputDevice.objects.get(id=output_device_id)
                    if not output_device:
                        return JsonResponse({"error": f"Output device with id {output_device_id} does not exist"}, status=400)

                    interaction_id = interaction.get("id", None)
                    existing_interaction = Interaction.objects.filter(id=interaction_id).first()

                    if "id" in interaction and existing_interaction:
                        existing_interaction.input_device.set(input_device)
                        existing_interaction.output_device.set(output_device)
                        existing_interaction.action = interaction.get("action", existing_interaction.action)
                        existing_interaction.additional_variables = interaction.get("additional_variables", existing_interaction.additional_variables)
                        existing_interaction.save()
                    else:
                        if "id" in interaction:
                            interaction.pop("id")
                        interaction.pop("input_device")
                        interaction.pop("output_device")
                        Interaction.objects.create(project=project, input_device=input_device, output_device=output_device, **interaction)
        
            serializer = ProjectSerializer(project)
            return JsonResponse(serializer.data)

        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)

@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(login_required, name="dispatch")
class InputDeviceListView(View):
    def get(self, request, project_id):
        """
        Get a list of all input devices in a project
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            input_devices = project.input_devices.all()
            serializer = InputDeviceSerializer(input_devices, many=True)
            return JsonResponse(serializer.data, safe=False)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)

    def post(self, request, project_id):
        """
        Add a new input device to a project
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            data = json.loads(request.body)
            device = InputDevice.objects.create(project=project, **data)
            serializer = InputDeviceSerializer(device)
            return JsonResponse(serializer.data)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        
@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(login_required, name="dispatch")
class InputDeviceDetailsView(View):
    def get(self, request, project_id, device_id):
        """
        Get details of a specific input device
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            device = project.input_devices.get(id=device_id)
            serializer = InputDeviceSerializer(device)
            return JsonResponse(serializer.data)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except InputDevice.DoesNotExist:
            return JsonResponse({"error": "Input device not found"}, status=404)
    
    def delete(self, request, project_id, device_id):
        """
        Delete an input device
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            device = project.input_devices.get(id=device_id)
            device.delete()
            return JsonResponse({"success": True, "message": "Input device deleted successfully"})
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except InputDevice.DoesNotExist:
            return JsonResponse({"error": "Input device not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    def put(self, request, project_id, device_id):
        """
        Update an input device
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            device = project.input_devices.get(id=device_id)
            data = json.loads(request.body)
            serializer = InputDeviceSerializer(device, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except InputDevice.DoesNotExist:
            return JsonResponse({"error": "Input device not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    
@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(login_required, name="dispatch")
class OutputDeviceListView(View):
    def get(self, request, project_id):
        """
        Get a list of all output devices in a project
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            output_devices = project.output_devices.all()
            serializer = OutputDeviceSerializer(output_devices, many=True)
            return JsonResponse(serializer.data, safe=False)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)

    def post(self, request, project_id):
        """
        Add a new output device to a project
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            data = json.loads(request.body)
            device = OutputDevice.objects.create(project=project, **data)
            serializer = OutputDeviceSerializer(device)
            return JsonResponse(serializer.data)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        
@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(login_required, name="dispatch")
class OutputDeviceDetailsView(View):
    def get(self, request, project_id, device_id):
        """
        Get details of a specific output device
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            device = project.output_devices.get(id=device_id)
            serializer = OutputDeviceSerializer(device)
            return JsonResponse(serializer.data)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except OutputDevice.DoesNotExist:
            return JsonResponse({"error": "Output device not found"}, status=404)
    
    def delete(self, request, project_id, device_id):
        """
        Delete an output device
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            device = project.output_devices.get(id=device_id)
            device.delete()
            return JsonResponse({"success": True, "message": "Output device deleted successfully"})
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except OutputDevice.DoesNotExist:
            return JsonResponse({"error": "Output device not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    def put(self, request, project_id, device_id):
        """
        Update an output device
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            device = project.output_devices.get(id=device_id)
            data = json.loads(request.body)
            serializer = OutputDeviceSerializer(device, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except OutputDevice.DoesNotExist:
            return JsonResponse({"error": "Output device not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(login_required, name="dispatch")
class InteractionListView(View):
    def get(self, request, project_id):
        """
        Get a list of all interactions in a project
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            interactions = project.interactions.all()
            serializer = InteractionSerializer(interactions, many=True)
            return JsonResponse(serializer.data, safe=False)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)

    def post(self, request, project_id):
        """
        Add a new interaction to a project
        """
        try:
            data = json.loads(request.body)
            if "project" in data:
                data.pop("project")
            project = Project.objects.get(id=project_id, owner=request.user)
            input_device_id = data.pop("input_device")
            output_device_id = data.pop("output_device")
            input_device = InputDevice.objects.get(id=input_device_id)
            output_device = OutputDevice.objects.get(id=output_device_id)
            interaction = Interaction.objects.create(project=project, input_device=input_device, output_device=output_device, **data)
            serializer = InteractionSerializer(interaction)
            return JsonResponse(serializer.data)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except InputDevice.DoesNotExist:
            return JsonResponse({"error": "Input device not found"}, status=404)
        except OutputDevice.DoesNotExist:
            return JsonResponse({"error": "Output device not found"}, status=404)
        
@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(login_required, name="dispatch")
class InteractionDetailsView(View):
    def get(self, request, project_id, interaction_id):
        """
        Get details of a specific interaction
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            interaction = project.interactions.get(id=interaction_id)
            serializer = InteractionSerializer(interaction)
            return JsonResponse(serializer.data)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except Interaction.DoesNotExist:
            return JsonResponse({"error": "Interaction not found"}, status=404)
    
    def delete(self, request, project_id, interaction_id):
        """
        Delete an interaction
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            interaction = project.interactions.get(id=interaction_id)
            interaction.delete()
            return JsonResponse({"success": True, "message": "Interaction deleted successfully"})
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except Interaction.DoesNotExist:
            return JsonResponse({"error": "Interaction not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    def put(self, request, project_id, interaction_id):
        """
        Update an interaction
        """
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
            interaction = project.interactions.get(id=interaction_id)
            data = json.loads(request.body)
            input_device_id = data.get("input_device")
            output_device_id = data.get("output_device")
            input_device = InputDevice.objects.get(id=input_device_id)
            output_device = OutputDevice.objects.get(id=output_device_id)

            if not input_device or not output_device:
                return JsonResponse({"error": "Input or output device not found"}, status=404)

            serializer = InteractionSerializer(interaction, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except Interaction.DoesNotExist:
            return JsonResponse({"error": "Interaction not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        