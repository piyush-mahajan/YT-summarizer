from fastapi import FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import JSONResponse

from pydantic import BaseModel

from app.services.transcript import process_youtube_url

from app.services.summary import summarize_text

import openai
import os
from dotenv import load_dotenv
import httpx
from typing import Optional

load_dotenv()  # Load environment variables



app = FastAPI()



# Configure CORS with more permissive settings for development

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],  # Allow all origins in development

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)



class YouTubeRequest(BaseModel):

    url: str



class ChatRequest(BaseModel):

    message: str

    transcript: Optional[str] = None



@app.post("/api/process")

async def process_url(request: YouTubeRequest):

    try:

        # Get transcript and video info

        result = await process_youtube_url(request.url)

        

        # Generate summary if transcript is available

        if result.get("transcript"):

            summary = await summarize_text(result["transcript"])

            result["summary"] = summary

        

        return JSONResponse(content=result)

    except Exception as e:

        return JSONResponse(

            status_code=500,

            content={"error": str(e)}

        )



@app.get("/api/health")

async def health_check():

    return {"status": "healthy"}



# Handle CORS preflight requests

@app.options("/api/process")

async def options_route():

    return JSONResponse(content={"status": "ok"})



# Add this new endpoint for chat
@app.post("/api/chat")
async def chat_with_transcript(request: ChatRequest):
    try:
        # Validate request
        if not request.message:
            raise HTTPException(status_code=400, detail="Message is required")

        # Get environment variables
        api_key = os.getenv("AZURE_OPENAI_KEY")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        deployment = os.getenv("AZURE_DEPLOYMENT_NAME")

        if not all([api_key, endpoint, deployment]):
            raise HTTPException(status_code=500, detail="Missing API configuration")

        # Prepare the conversation
        system_message = "You are a helpful assistant that answers questions about video transcripts."
        user_message = f"""Context: {request.transcript if request.transcript else 'No transcript provided'}

Question: {request.message}

Please provide a relevant answer based on the context."""

        # Configure the client
        client = openai.AzureOpenAI(
            api_key=api_key,
            api_version="2024-05-01-preview",
            azure_endpoint=endpoint
        )

        try:
            # Make the API call
            response = client.chat.completions.create(
                model=deployment,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=800
            )

            # Extract and return the response
            ai_response = response.choices[0].message.content.strip()
            return JSONResponse(content={"response": ai_response})

        except Exception as api_error:
            print(f"API Error: {str(api_error)}")
            raise HTTPException(status_code=500, detail=f"API Error: {str(api_error)}")

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
