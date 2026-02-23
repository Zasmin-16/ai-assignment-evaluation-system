import requests
from io import BytesIO
from PyPDF2 import PdfReader

def extract_text_from_url(url):
    try:
        response = requests.get(url)
        if response.status_code != 200:
            return ""

        if len(response.content) == 0:
            return ""

        pdf_stream = BytesIO(response.content)
        reader = PdfReader(pdf_stream)

        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted

        return text.strip()

    except Exception as e:
        print("TEXT EXTRACTION ERROR:", e)
        return ""