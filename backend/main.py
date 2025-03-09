from fastapi import FastAPI, HTTPException
import requests
import re
from pydantic import BaseModel
from typing import Dict, List
import os
app = FastAPI()
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

class SymptomsInput(BaseModel):
    symptoms: str

class SectionContent(BaseModel):
    title: str
    content: List[str]

class ChatbotResponse(BaseModel):
    greeting: str
    sections: List[SectionContent]

def clean_response_text(text: str) -> str:
    # Basic cleanup
    text = text.replace('\\n', '\n')
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    text = re.sub(r' +', ' ', text)
    
    # Remove any numbered prefixes from section titles
    text = re.sub(r'\d+\.\s*(\d+\.\s*)*(Disease Prediction|Self-Check Guide|First Aid|Precautions|Solutions):', r'\1:', text)
    
    return text.strip()

def format_section_content(content: str) -> List[str]:
    if not content or content == "No information available.":
        return ["No information available."]
    
    # Split content by bullet points or numbered items if they exist
    if re.search(r'(?m)^[-•*]\s', content):
        items = re.split(r'(?m)^[-•*]\s', content)
        return [item.strip() for item in items if item.strip()]
    
    # Split by sentences if no bullet points
    sentences = re.split(r'(?<=[.!?])\s+', content)
    return [s.strip() for s in sentences if s.strip()]

def extract_sections(text: str) -> ChatbotResponse:
    # Extract greeting
    greeting_match = re.search(r'^(.*?)(?=Disease Prediction:|$)', text, re.DOTALL)
    greeting = greeting_match.group(1).strip() if greeting_match else "Hello! I'm here to help you."
    
    # Define section titles and their patterns
    section_patterns = {
        "Disease Prediction": r'Disease Prediction:(.*?)(?=Self-Check Guide:|$)',
        "Self-Check Guide": r'Self-Check Guide:(.*?)(?=First Aid:|$)',
        "First Aid": r'First Aid:(.*?)(?=Precautions:|$)',
        "Precautions": r'Precautions:(.*?)(?=Solutions:|$)',
        "Solutions": r'Solutions:(.*?)(?=$)'
    }
    
    # Extract and format sections
    sections = []
    for title, pattern in section_patterns.items():
        match = re.search(pattern, text, re.DOTALL)
        content = match.group(1).strip() if match else "No information available."
        formatted_content = format_section_content(content)
        sections.append(SectionContent(title=title, content=formatted_content))
    
    return ChatbotResponse(greeting=greeting, sections=sections)

@app.post("/chatbot/")
async def chatbot(input_data: SymptomsInput):
    prompt = (
        "You are an empathetic medical AI assistant. Follow these requirements exactly:\n\n"
        "1. Start with a brief, caring greeting\n"
        "2. Then provide information in these exact sections:\n\n"
        "Disease Prediction:\n"
        "- Provide a careful assessment of possible conditions based on symptoms\n"
        "- Mention that this is not a definitive diagnosis\n\n"
        "Self-Check Guide:\n"
        "- List specific symptoms to monitor\n"
        "- Include warning signs that require immediate medical attention\n\n"
        "First Aid:\n"
        "- Provide clear, immediate self-care steps\n"
        "- Include dosage guidelines for any suggested medications\n\n"
        "Precautions:\n"
        "- List preventive measures\n"
        "- Include lifestyle recommendations\n\n"
        "Solutions:\n"
        "- Suggest treatment options\n"
        "- Provide clear guidance on when to seek professional medical help\n\n"
        f"Based on these symptoms: {input_data.symptoms}\n\n"
        "Important:\n"
        "- Use bullet points for each section\n"
        "- Use plain English only\n"
        "- No special characters, emojis, or other languages"
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "topK": 20,
            "topP": 0.8,
            "maxOutputTokens": 1024,
        }
    }

    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=payload
        )
        response.raise_for_status()
        
        ai_response = response.json()
        
        if "candidates" in ai_response:
            raw_text = ai_response["candidates"][0]["content"]["parts"][0]["text"]
            cleaned_text = clean_response_text(raw_text)
            formatted_response = extract_sections(cleaned_text)
            
            return formatted_response
            
        else:
            raise HTTPException(status_code=422, detail="Unable to generate response")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))