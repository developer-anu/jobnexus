# app/models/job_model.py

from pydantic import BaseModel
from typing import Optional

class JobModel(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    experience: Optional[str] = None
    salary: Optional[str] = None
    site_url: Optional[str] = None

