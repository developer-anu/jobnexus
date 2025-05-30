import os
import hashlib
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from app.services.embedding_service import get_embedding
from app.models.job_model import JobModel 


# Load environment variables from .env file
load_dotenv()

# Get Pinecone config from environment
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV", "us-east-1")
INDEX_NAME = "jobnexus"
VECTOR_DIMENSION = 384  # should match your embedding size

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Create index if not exists
if INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=INDEX_NAME,
        dimension=VECTOR_DIMENSION,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=PINECONE_ENV)
    )

# Get a reference to the index
index = pc.Index(INDEX_NAME)

def normalize_job_fields(job: dict) -> dict:
    """
    Normalize job dict to ensure all required fields exist with default empty strings.
    """
    required_fields = [
        "id",
        "title",
        "company",
        "location",
        "description",
        "apply_link",
        "thumbnail",
        "posted",
        "via"
    ]
    normalized_job = {}
    for field in required_fields:
        value = job.get(field)
        if value is None:
            normalized_job[field] = ""  # Replace None with empty string
        else:
            normalized_job[field] = value
    return normalized_job


def generate_id(job):
    # You can modify this function to include more fields if needed
    identifier = f"{job['title']}_{job['company']}_{job['location']}"
    return hashlib.md5(identifier.encode()).hexdigest()

'''def upsert_jobs_to_pinecone_check_duplicates(jobs: list[dict]):
    vectors = []
    inserted = 0

    for job in jobs:
        vector_id = generate_id(job)

        # Fetch to check existence
        existing = index.fetch(ids=[vector_id])

        if vector_id in existing.vectors:
            print(f"Job with ID {vector_id} already exists. Skipping.")
            continue
        # Prepare job metadata
        job_metadata = {
            "title": job.get("title", ""),
            "company": job.get("company", ""),
            "description": job.get("description", ""),
            "location": job.get("location", ""),
            "experience": job.get("experience", ""),
            "salary": job.get("salary", ""),
            "site_url": job.get("site_url", "")
        }

        # Prepare embedding
        job_text = f"{job['title']} {job['company']} {job['description']}"
        embedding = get_embedding(job_text)

        # Add to list for batch upsert
        vectors.append((vector_id, embedding, job_metadata))
        inserted += 1

    # Perform batch upsert only if new jobs exist
    if vectors:
        index.upsert(vectors)
        print(f"✅ {inserted} new jobs upserted successfully.")
    else:
        print("⚠️ No new jobs to upsert.")
    return {"message": f"{inserted} new jobs added to Pinecone."}
'''

def upsert_jobs_to_pinecone_check_duplicates(jobs: list[dict]):
    vectors = []
    inserted = 0

    for job in jobs:
        job = normalize_job_fields(job)  # Normalize fields here

  # Defensive check: skip jobs without title or company
        if not job['title'] or not job['company']:
            print("Skipping job due to missing title or company:", job)
            continue
        vector_id = generate_id(job)

        existing = index.fetch(ids=[vector_id])

        if vector_id in existing.vectors:
            print(f"Job with ID {vector_id} already exists. Skipping.")
            continue

        job_metadata = {
            "title": job["title"],
            "company": job["company"],
            "description": job["description"],
            "location": job["location"],
            "apply_link": job["apply_link"],
            "thumbnail": job["thumbnail"],
            "posted": job["posted"],
            "via": job["via"]
        }

        job_text = f"{job.get('title')} {job['company']} {job['description']}"
        embedding = get_embedding(job_text)

        vectors.append((vector_id, embedding, job_metadata))
        inserted += 1

    if vectors:
        index.upsert(vectors)
        print(f"✅ {inserted} new jobs upserted successfully.")
    else:
        print("⚠️ No new jobs to upsert.")
    return {"message": f"{inserted} new jobs added to Pinecone."}


def upsert_jobs_to_pinecone(jobs: list[dict]):
    vectors = []
    for job in jobs:
        job = normalize_job_fields(job)  # Normalize here

        job_id = job["id"]
        text_to_embed = f"{job['title']} {job['description']} {job['company']} {job['location']}"
        embedding = get_embedding(text_to_embed)
        vectors.append((job_id, embedding, job))
    index.upsert(vectors)
    return {"message": f"{len(vectors)} jobs upserted successfully"}



def query_jobs_from_pinecone(query: str, top_k: int = 10) -> list[dict]:
    """
    Query jobs by text similarity using embedding.
    Returns top_k matching job metadata.
    """
    query_embedding = get_embedding(query)
    query_response = index.query(queries=[query_embedding], top_k=top_k, include_metadata=True)
    
    matches = query_response.results[0].matches
    return [match.metadata for match in matches]

def recommend_jobs(user_input: str, top_k: int = 5) -> list[JobModel]:
    # Step 1: Get embedding from user input
    query_vector = get_embedding(user_input)

    # Step 2: Query Pinecone for similar jobs
    index = pc.Index(INDEX_NAME)
    response = index.query(vector=query_vector, top_k=top_k, include_metadata=True)

    # Step 3: Convert metadata to JobModel list
    recommended_jobs = []
    for match in response.get("matches", []):
        metadata = match["metadata"]
        job = JobModel(**metadata)
        recommended_jobs.append(job)

    return recommended_jobs


def query_jobs(vector_query: list[float], top_k: int = 10):
    """
    Query Pinecone index with a vector to get top_k similar job vectors.
    
    Args:
        vector_query: List of floats representing the embedding vector.
        top_k: Number of top matches to return.
        
    Returns:
        List of matched job metadata.
    """
    query_response = index.query(
        vector=vector_query,
        top_k=top_k,
        include_metadata=True
    )
    
    matches = query_response.matches
    # Extract metadata of matched jobs
    matched_jobs = [match.metadata for match in matches]
    return matched_jobs

def get_query_vector(user_input: str) -> list[float]:
    # Generate embedding vector from user input text
    return get_embedding(user_input)

# Delete jobs from Pinecone index by IDs
def delete_jobs_from_pinecone(ids: list[str]):
    """
    Delete jobs from Pinecone index given a list of job IDs.
    """
    index.delete(ids=ids)


# Fetch jobs metadata by IDs (fetches vectors with metadata)
def fetch_jobs_by_ids(ids: list[str]) -> list[dict]:
    """
    Fetch jobs metadata from Pinecone by their IDs.
    Returns a list of job metadata dicts.
    """
    fetch_response = index.fetch(ids=ids)
    # fetch_response.vectors is a dict keyed by id, each value has 'metadata'
    return [fetch_response.vectors[job_id]['metadata'] for job_id in ids if job_id in fetch_response.vectors]


# List all Pinecone indexes
def list_all_indexes() -> list[str]:
    """
    Return a list of all index names available in Pinecone environment.
    """
    return pc.list_indexes().names()


# Check if an index exists
def index_exists(name: str) -> bool:
    """
    Check if the Pinecone index with given name exists.
    """
    return name in pc.list_indexes().names()


# Delete entire Pinecone index (use with care!)
def delete_index(name: str):
    """
    Delete a Pinecone index by name.
    """
    pc.delete_index(name)