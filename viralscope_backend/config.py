import os
from dotenv import load_dotenv

# Load root .env
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
env_path = os.path.join(root_dir, '.env')
if os.path.exists(env_path):
    load_dotenv(env_path, override=True)
else:
    load_dotenv(override=True)

class Config:
    # Server config
    PORT = int(os.environ.get('VIRALSCOPE_PORT', 5005))
    HOST = os.environ.get('VIRALSCOPE_HOST', '0.0.0.0')
    DEBUG = os.environ.get('VIRALSCOPE_DEBUG', 'False').lower() == 'true'

    # MongoDB config
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/viralscope')
    DB_NAME = os.environ.get('DB_NAME', 'viralscope')

    # Gemini & LLM Configuration
    # Supports GEMINI_API_KEY for native google-genai, or LLM_API_KEY/LLM_BASE_URL for Dashscope/OpenAI compatible API
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    LLM_API_KEY = os.environ.get('LLM_API_KEY')
    LLM_BASE_URL = os.environ.get('LLM_BASE_URL', 'https://dashscope.aliyuncs.com/compatible-mode/v1')
    LLM_MODEL_NAME = os.environ.get('LLM_MODEL_NAME', 'gemini-2.5-flash')

    # MiroFish Engine API URL
    MIROFISH_API_BASE = os.environ.get('MIROFISH_API_BASE', 'http://127.0.0.1:5001/api')

    # Storage paths
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    FRAMES_FOLDER = os.path.join(BASE_DIR, 'uploads', 'frames')
    SAMPLE_VIDEOS_FOLDER = os.path.join(BASE_DIR, 'uploads', 'sample_videos')
    REPORTS_FOLDER = os.path.join(BASE_DIR, 'uploads', 'reports')
    DATA_FILE = os.path.join(BASE_DIR, 'data', 'viralscope_data.json')

    # File uploads
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024  # 200MB max per request
    ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv', 'webm'}

    @classmethod
    def ensure_directories(cls):
        for folder in [cls.UPLOAD_FOLDER, cls.FRAMES_FOLDER, cls.SAMPLE_VIDEOS_FOLDER, cls.REPORTS_FOLDER, os.path.dirname(cls.DATA_FILE)]:
            os.makedirs(folder, exist_ok=True)
