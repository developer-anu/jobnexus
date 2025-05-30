from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Job Recommender API"}
