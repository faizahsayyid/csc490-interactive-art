from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.urls import reverse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.utils import timezone
from .models import Project
from .serializer import ProjectSerializer
import os


# EndPoint: /projects/list/
class ProjectList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """View all projects of the user"""
        projects = Project.objects.filter(owner=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Create a new project"""
        data = request.data.copy()
        data['owner'] = request.user.id
        serializer = ProjectSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save the right path for the code using the input_device, input_action, output_device, and output_action
            input_device = serializer.validated_data['input_device']
            input_action = serializer.validated_data['input_action']
            output_device = serializer.validated_data['output_device']
            output_action = serializer.validated_data['output_action']
            code_path = f'code_generation/{input_device}/{input_action}/{output_device}/{output_action}.py'
            serializer.save(code=code_path)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# EndPoint: /projects/<int: project_id>/
class ProjectDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        """View a specific project's details"""
        project = get_object_or_404(Project, id=project_id)
        self.check_object_permissions(request, project)

        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    def patch(self, request, project_id):
        """Edit a specific project's details"""
        project = get_object_or_404(Project, id=project_id)
        self.check_object_permissions(request, project)

        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
             # Save the right path for the code using the input_device, input_action, output_device, and output_action
            input_device = serializer.validated_data['input_device']
            input_action = serializer.validated_data['input_action']
            output_device = serializer.validated_data['output_device']
            output_action = serializer.validated_data['output_action']
            code_path = f'code_generation/{input_device}/{input_action}/{output_device}/{output_action}.py'
            serializer.save(code=code_path)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, project_id):
        """Delete a specific project"""
        project = get_object_or_404(Project, id=project_id)
        self.check_object_permissions(request, project)

        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def get_code_file(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Assuming 'code_path' is the path to the code file for the specified project
        code_path = Project.objects.get(id=project_id).code

        if os.path.exists(code_path) and os.path.isfile(code_path):
            with open(code_path, 'r') as file:
                code_contents = file.read()

            # Return the file contents in the response
            return Response({'code': code_contents}, status=status.HTTP_200_OK)
        else:
            # Return a 404 response if the file doesn't exist(it might not be supported by the server yet)
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
