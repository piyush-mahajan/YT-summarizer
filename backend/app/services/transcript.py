import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
import re
from translate import Translator
from fastapi import HTTPException
import os
import whisper

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
        
        try:
            # Try to get transcript
            transcript = await get_transcript(video_id)
            if transcript:
                # If transcript exists, translate and return
                english_transcript = translator.translate(transcript)
                return {
                    "title": title,
                    "thumbnail": thumbnail,
                    "transcript": english_transcript,
                    "url": url,
                    "hasTranscript": True
                }
            
        except (NoTranscriptFound, TranscriptsDisabled) as e:
            # If transcript is not available, return specific error
            return {
                "title": title,
                "thumbnail": thumbnail,
                "url": url,
                "hasTranscript": False,
                "error": "No transcript available",
                "canExtractAudio": True
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

async def get_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        raw_transcript = next(iter(transcript_list)).fetch()
        
        # Format transcript with timestamps and text
        formatted_segments = []
        full_text = []
        
        for entry in raw_transcript:
            # Convert timestamp to MM:SS format
            time = entry['start']
            minutes = int(time // 60)
            seconds = int(time % 60)
            timestamp = f"{minutes:02d}:{seconds:02d}"
            
            text = entry['text'].strip()
            
            formatted_segments.append({
                'timestamp': timestamp,
                'text': text,
                'start': entry['start']
            })
            
            # Add to full text with timestamp
            full_text.append(f"[{timestamp}] {text}")
        
        # Sort segments by start time
        formatted_segments.sort(key=lambda x: x['start'])
        
        return {
            'text': '\n'.join(full_text),
            'segments': formatted_segments
        }
    except Exception as e:
        print(f"Transcript error: {e}")
        return None

async def extract_audio(video_url):
    try:
        audio_dir = "extracted_audio"
        os.makedirs(audio_dir, exist_ok=True)
        
        video_id = video_url.split('=')[-1]
        audio_file_path = os.path.join(audio_dir, f"{video_id}.mp3")

        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': audio_file_path,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        return audio_file_path
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return None

async def audio_to_text(audio_file_path):
    try:
        model = whisper.load_model("base")
        result = model.transcribe(audio_file_path)
        return result["text"]
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return None