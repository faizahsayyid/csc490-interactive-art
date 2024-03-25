from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from .utils.ino_code_ds import inoCodeDataStructure

@method_decorator(csrf_exempt, name='dispatch')
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
        

