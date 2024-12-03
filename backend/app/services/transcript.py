import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
import re
from translate import Translator
from fastapi import HTTPException

translator = Translator(to_lang="en")

async def process_youtube_url(url):
    try:
        # Extract video ID
        video_id_match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
        if not video_id_match:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
        video_id = video_id_match.group(1)
        
        # Get video info
        with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
            info = ydl.extract_info(url, download=False)
            title = info.get('title', '')
            thumbnail = info.get('thumbnail', '')
        
        # Get transcript
        transcript = await get_transcript(video_id)
        
        # Translate if needed and transcript exists
        english_transcript = None
        if transcript:
            try:
                english_transcript = translator.translate(transcript)
            except Exception as e:
                print(f"Translation error: {e}")
                english_transcript = transcript  # Fallback to original if translation fails
        
        return {
            "title": title,
            "thumbnail": thumbnail,
            "transcript": english_transcript,
            "original_transcript": transcript,
            "url": url
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

async def get_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        transcript = next(iter(transcript_list)).fetch()
        return " ".join([entry['text'] for entry in transcript])
    except Exception as e:
        print(f"Transcript error: {e}")
        return None 