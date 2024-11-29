import requests

url = "http://127.0.0.1:8000/api/process"
payload = {"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())