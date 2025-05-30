from app.services.pinecone_client import upsert_jobs_to_pinecone
import uuid

# Generate a dummy 1536-dim vector
dummy_vector = [0.01] * 1024

# Create a test job vector
test_job = {
    "id": str(uuid.uuid4()),  # unique ID
    "values": dummy_vector,
    "metadata": {
        "title": "Test Job",
        "location": "Remote",
        "description": "This is a test job description for Pinecone integration."
    }
}

# Upsert the test job vector to Pinecone
try:
    upsert_jobs_to_pinecone([test_job])
    print("✅ Test job upserted successfully!")
except Exception as e:
    print("❌ Error during upsert:", e)
