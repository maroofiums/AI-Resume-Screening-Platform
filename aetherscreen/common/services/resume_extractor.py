from pathlib import Path
import pypdf
from docx import Document
from django.core.exceptions import ValidationError

class ResumeExtractor:
    """Production-ready resume text extraction service"""

    @staticmethod
    def extract_text(file_path: str) -> str:
        """Extract text from PDF or DOCX"""
        ext = Path(file_path).suffix.lower()
        
        try:
            if ext == '.pdf':
                return ResumeExtractor._extract_pdf(file_path)
            elif ext in ['.docx', '.doc']:
                return ResumeExtractor._extract_docx(file_path)
            else:
                raise ValidationError(f"Unsupported file type: {ext}. Only PDF and DOCX allowed.")
        except Exception as e:
            raise ValidationError(f"Failed to extract text: {str(e)}")

    @staticmethod
    def _extract_pdf(file_path: str) -> str:
        text = ""
        with open(file_path, 'rb') as f:
            reader = pypdf.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()

    @staticmethod
    def _extract_docx(file_path: str) -> str:
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])