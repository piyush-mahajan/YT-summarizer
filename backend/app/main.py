from fastapi import FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import JSONResponse

from pydantic import BaseModel

from app.services.transcript import process_youtube_url, get_transcript

from app.services.summary import summarize_text
# from googletrans import Translator
import openai
import os
from dotenv import load_dotenv
import httpx
from typing import Optional, List
from .services.chat import ChatService

load_dotenv()  # Load environment variables


app = FastAPI()



# Configure CORS with more permissive settings for development

app.add_middleware(

    CORSMiddleware,

    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add ACV skeleton port

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)



class YouTubeRequest(BaseModel):

    url: str



class ChatMessage(BaseModel):

    role: str

    content: str


class ChatRequest(BaseModel):

    messages: List[ChatMessage]

    transcript: str


class TranslationRequest(BaseModel):

    text: str

    target_lang: str

    source_lang: str = 'auto'

    

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
async def chat(request: ChatRequest):
    try:
        chat_service = ChatService()
        response = await chat_service.get_chat_response(
            messages=[msg.dict() for msg in request.messages],
            transcript=request.transcript
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/translate")
async def translate_text(request: TranslationRequest):
    try:
        translator = Translator()
        translation = translator.translate(
            request.text,
            dest=request.target_lang,
            src=request.source_lang
        )
        
        return {
            "translated_text": translation.text,
            "source_lang": translation.src,
            "target_lang": translation.dest
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )

@app.get("/api/transcript/{video_id}")
async def get_video_transcript(video_id: str, interval: int = 15):
    try:
        transcript = await get_transcript(video_id, interval)
        if not transcript:
            raise HTTPException(status_code=404, detail="Transcript not found")
        return transcript
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))