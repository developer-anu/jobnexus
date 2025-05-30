from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from app.services.pinecone_client import upsert_jobs_to_pinecone, query_jobs, get_query_vector , upsert_jobs_to_pinecone_check_duplicates
from app.services.job_scraper import fetch_jobs_from_google
from app.services.recommendations_service import recommend_jobs
from app.models.job_model import JobModel
from typing import List
from fastapi import APIRouter, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI()

router = APIRouter()
class JobQueryRequest(BaseModel):
    query_text: str
    top_k: int = 10
    
# Input model
class JobItem(BaseModel):
    id: Optional[str] = ""
    title: str
    company: str
    location: Optional[str] = ""
    description: Optional[str] = ""

# Allow requests from Angular app
origins = [
    "http://localhost:4200",  # Angular frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Set this to ["*"] for all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@router.post("/store-jobs")
def store_jobs(jobs: List[JobItem]):
    try:
        job_dicts = [job.dict() for job in jobs]
        result = upsert_jobs_to_pinecone_check_duplicates(job_dicts)
        if not result or "message" not in result:
            raise HTTPException(status_code=500, detail="Invalid response from upsert function")

        return {"success": True, "message": result["message"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search-jobs")
def search_jobs(query: str, location: Optional[str] = "India"):
    try:
        jobs = fetch_jobs_from_google(query=query, location=location)
        return {"success": True, "results": jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch jobs: {str(e)}")

@router.post("/pinecone/upsert")
def upsert_jobs(jobs: List[JobModel]):
    response = upsert_jobs_to_pinecone(jobs)
    return {"message": "Jobs upserted successfully", "result": response}

@router.post("/jobs/search")
async def search_jobs(request: JobQueryRequest):
    vector_query = get_query_vector(request.query_text)
    matched_jobs = query_jobs(vector_query, top_k=request.top_k)
    return {"success": True, "jobs": matched_jobs}

@router.get("/recommend_jobs")
async def get_job_recommendations(query: str = Query(..., description="User input to find relevant jobs")):
    results = recommend_jobs(query)
    return {"success": True, "data": results}


@router.post("/recommend")
def get_recommendations(query: str):
    results = recommend_jobs(query)
    return [job.dict() for job in results]

@router.get("/recommend-jobs")
def recommend_jobs_route(query: str = Query(..., description="User input to find relevant jobs"), top_k: int = 5):
    results = recommend_jobs(query, top_k)
    # results is List[JobModel], convert to dict for JSON response
    return {"success": True, "recommended_jobs": [job.dict() for job in results]}