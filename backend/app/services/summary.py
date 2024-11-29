import openai
from dotenv import load_dotenv
import os
import requests
load_dotenv()
async def summarize_text(text):
    try:
        # Azure OpenAI configuration
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")  # Your Azure endpoint
        api_key = os.getenv("AZURE_OPENAI_KEY")        # Your Azure API key
        deployment_name = os.getenv("AZURE_DEPLOYMENT_NAME")  # Your deployment name
        api_version = "2024-05-01-preview";  # Update based on your Azure configuration
        # Construct the full URL for the API
        url = f"{endpoint}/openai/deployments/{deployment_name}/chat/completions?api-version={api_version}"
        print(url)
        # Prepare the request payload
        payload = {
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that summarizes video transcripts."},
                {"role": "user", "content": f"Please summarize this transcript:\n\n{text}"}
            ],
            "max_tokens": 500,  # Adjust based on your needs
            "temperature": 0.7  # Adjust as needed
        }

        headers = {
            "Content-Type": "application/json",
            "api-key": api_key
        }

        # Make the POST request to Azure OpenAI
        response = requests.post(url, json=payload, headers=headers)

        # Check if the request was successful
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"].strip()
        else:
            # Raise an exception with the error details
            raise Exception(f"Error from Azure OpenAI: {response.status_code} - {response.text}")

    except Exception as e:
        # Log and re-raise the exception for debugging purposes
        print(f"Error in summarize_text: {str(e)}")
        raise Exception(f"Error generating summary: {str(e)}")