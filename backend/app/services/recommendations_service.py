from app.services.embedding_service import get_embedding
from app.services.pinecone_client import index

def recommend_jobs(user_query: str, top_k: int = 10):
    """
    Recommend jobs based on user input text by querying Pinecone with embeddings.
    Returns top_k job metadata results sorted by similarity.
    """
    # Step 1: Get embedding for user query
    query_embedding = get_embedding(user_query)

    # Step 2: Query Pinecone index with this vector
    query_response = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )

    # Step 3: Extract metadata from matches
    jobs = [match['metadata'] for match in query_response['matches']]
    
    return jobs
