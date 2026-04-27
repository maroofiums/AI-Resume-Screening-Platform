from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

class AIScorer:
    """Lazy-loaded AI Scorer - avoids loading model during makemigrations/checks"""

    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            # Use local cache if available, fallback to download
            cache_folder = os.path.expanduser("~/.cache/torch/sentence_transformers")
            try:
                cls._model = SentenceTransformer(
                    'sentence-transformers/all-MiniLM-L6-v2',
                    cache_folder=cache_folder,
                    local_files_only=False  # Allow download if not present
                )
                print("✅ AI Model loaded successfully")
            except Exception as e:
                print(f"⚠️ Model loading warning: {e}")
                # Fallback: try without token/client issues
                cls._model = SentenceTransformer('all-MiniLM-L6-v2')
        return cls._model

    @staticmethod
    def get_embedding(text: str):
        if not text or not text.strip():
            return None
        model = AIScorer.get_model()
        return model.encode(text, convert_to_numpy=True).tolist()

    @staticmethod
    def compute_similarity(resume_embedding, job_embedding):
        if not resume_embedding or not job_embedding:
            return 0.0
        try:
            return float(cosine_similarity([resume_embedding], [job_embedding])[0][0])
        except Exception:
            return 0.0