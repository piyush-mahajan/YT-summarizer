import os
import whisper
import yt_dlp

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