import requests
backend_url = "http://localhost:8000"
url = f"{backend_url}/arduino/api/"

headers = {
    'Content-Type': 'application/json'
}

data = [[11, [13], "negate_output_on_input", [1000]]]

response = requests.post(url, headers=headers, json=data)
print(response.json())