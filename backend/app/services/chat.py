from fastapi import HTTPException
from typing import List
import openai
import os

class ChatService:
    def __init__(self):
        # Use Azure OpenAI configuration
        self.api_key = os.getenv("AZURE_OPENAI_KEY")
        self.endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.deployment = os.getenv("AZURE_DEPLOYMENT_NAME")

    async def get_chat_response(self, messages: List[dict], transcript: str) -> str:
        try:
            if not transcript or not isinstance(transcript, str):
                raise HTTPException(
                    status_code=400, 
                    detail="Transcript must be a non-empty string"
                )

            if not all([self.api_key, self.endpoint, self.deployment]):
                raise HTTPException(
                    status_code=500, 
                    detail="Missing API configuration"
                )

            # Configure Azure OpenAI client
            client = openai.AzureOpenAI(
                api_key=self.api_key,
                api_version="2024-05-01-preview",
                azure_endpoint=self.endpoint
            )

            # Prepare system message with context
            system_message = {
                "role": "system",
                "content": (
                    f"You are analyzing this video transcript. "
                    f"Here's the relevant part: {transcript[:1000]}... "
                    "Answer questions based on this content."
                )
            }

            # Combine messages
            all_messages = [system_message] + messages

            # Get response from Azure OpenAI
            response = client.chat.completions.create(
                model=self.deployment,
                messages=all_messages,
                temperature=0.7,
                max_tokens=500
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"Chat error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e)) 