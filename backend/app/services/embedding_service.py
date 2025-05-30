from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
embedding = model.encode("test sentence")
print(len(embedding))  # This will print 384

def get_embedding(text: str) -> list[float]:
    return model.encode(text).tolist()
