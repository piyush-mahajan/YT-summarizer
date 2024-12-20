from fastapi import HTTPException
from typing import List
import openai
import os
import re

class ChatService:
    def __init__(self):
        # Use Azure OpenAI configuration
        self.api_key = os.getenv("AZURE_OPENAI_KEY")
        self.endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.deployment = os.getenv("AZURE_DEPLOYMENT_NAME")

    def format_response(self, text: str) -> str:
        # Add markdown formatting to the response
        
        # Format lists
        text = re.sub(r'^\d+\.\s', '1. ', text, flags=re.MULTILINE)
        text = re.sub(r'^[-•]\s', '* ', text, flags=re.MULTILINE)
        
        # Format key phrases as bold
        patterns = [
            'Key Points:', 'Important:', 'Note:', 'Summary:',
            'Example:', 'Definition:', 'Context:', 'Analysis:',
            'Conclusion:', 'In the video:', 'According to the transcript:'
        ]
        for pattern in patterns:
            text = text.replace(pattern, f'**{pattern}**')
            
        # Convert URLs to markdown links
        url_pattern = r'(https?://[^\s]+)'
        text = re.sub(url_pattern, r'[\1](\1)', text)
        
        # Add spacing for readability
        text = text.replace('\n', '\n\n')
        
        return text

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
                    "You are analyzing a video transcript. Format your responses using markdown:\n"
                    "- Use **bold** for emphasis\n"
                    "- Use bullet points and numbered lists\n"
                    "- Include headers where appropriate\n"
                    "- Format code snippets with backticks\n"
                    f"\nHere's the transcript context: {transcript[:1000]}..."
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

            # Format the response with markdown
            formatted_response = self.format_response(response.choices[0].message.content)
            return formatted_response

        except Exception as e:
            print(f"Chat error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e)) 