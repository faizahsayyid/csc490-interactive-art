from django.db import models
import json
from .utils.action import Program

class ProgramModel(models.Model):
    """
    Represents a program for a project

    Attributes:
    - project_id: ID of the project
    - program: Serialized representation of the Program object
    """
    project_id = models.IntegerField()
    program = models.TextField(null=True, blank=True)

    def set_program(self, program: Program):
        """
        Serialize and set the Program object
        """
        self.program = json.dumps(program)

    def get_program(self) -> Program:
        """
        Deserialize and return the Program object
        """
        return json.loads(self.program)

    

# Ignore this proect model for now
# class ProjectModel(models.Model):
#     name = models.CharField(max_length=100)
#     description = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return self.name

#     def save_project(self, name, description):
#         self.name = name
#         self.description = description
#         self.save()

#     def save_program(self, program):
#         program_model = ProgramModel(project_id=self.id, program=program)
#         program_model.save()

#     def get_program(self):
#         return ProgramModel.objects.filter(project_id=self.id).first()

#     def get_program_code(self):
#         program = self.get_program()
#         if program:
#             return program.code
#         return None
    