from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.services.transcript import process_youtube_url
from app.services.summary import summarize_text

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