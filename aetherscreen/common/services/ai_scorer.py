from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Load model once (cached in production)
model = SentenceTransformer('all-MiniLM-L6-v2')

class AIScorer:
    """AI Embedding & Scoring Service"""

    @staticmethod
    def get_embedding(text: str):
        if not text or not text.strip():
            return None
        return model.encode(text, convert_to_numpy=True).tolist()

    @staticmethod
    def compute_similarity(resume_embedding, job_embedding):
        if not resume_embedding or not job_embedding:
            return 0.0
        return float(cosine_similarity([resume_embedding], [job_embedding])[0][0])