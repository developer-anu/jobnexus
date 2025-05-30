import os
import requests
from dotenv import load_dotenv

load_dotenv()

SERP_API_KEY = os.getenv("SERP_API_KEY")

def fetch_jobs_from_google(query: str, location: str) -> list:
    print("Using SERPAPI Key:", SERP_API_KEY)
    if not SERP_API_KEY:
        raise EnvironmentError("Missing SERP_API_KEY in environment")

    params = {
        "engine": "google_jobs",
        "q": query,
        "location": location,
        "api_key": SERP_API_KEY
    }

    response = requests.get("https://serpapi.com/search", params=params)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch jobs: {response.text}")

    data = response.json()
    jobs = data.get("jobs_results", [])

    # Simplify job output
    job_list = []
    for job in jobs:
        job_list.append({
            "title": job.get("title"),
            "company": job.get("company_name"),
            "location": job.get("location"),
            "description": job.get("description"),
            "via": job.get("via"),
            "thumbnail": job.get("thumbnail"),
            "extensions":job.get("extensions"),
            "posted": job.get("detected_extensions", {}).get("posted_at"),
            "apply_link": job.get("related_links", {}).get("link")
        })

    return job_list
'''
import os
import requests
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()  # Load .env file

SERPAPI_KEY = os.getenv("SERPAPI_API_KEY")
SERPAPI_URL = "https://serpapi.com/search.json"


def fetch_jobs_from_google(title: str, location: str, num_results: int = 10) -> List[Dict]:
    """
    Fetch jobs from Google Jobs via SerpAPI based on title and location.
    
    Args:
        title (str): Job title (e.g., "Frontend Developer")
        location (str): Job location (e.g., "New York")
        num_results (int): Number of job results to return

    Returns:
        List[Dict]: A list of job postings with basic details
    """
    if not SERPAPI_KEY:
        raise ValueError("Missing SERPAPI_API_KEY in environment variables")

    params = {
        "engine": "google_jobs",
        "q": f"{title} in {location}",
        "hl": "en",
        "api_key": SERPAPI_KEY
    }

    try:
        response = requests.get(SERPAPI_URL, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get("jobs_results", [])[:num_results]

    except requests.RequestException as e:
        print(f"Error fetching jobs: {e}")
        return []
'''