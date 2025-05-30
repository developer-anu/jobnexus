import os
from dotenv import load_dotenv

load_dotenv()  # Load .env at app start

class Settings:
    PROJECT_NAME: str = "AI Job Recommender"
    API_VERSION: str = "v1"
    SERPAPI_API_KEY: str = os.getenv("SERPAPI_API_KEY")
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    PINECONE_ENV: str = os.getenv("PINECONE_ENV", "")

settings = Settings()
