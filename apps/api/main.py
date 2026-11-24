
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from gemini_service import generate_answer

app = FastAPI(
    title="MedCo API",
    description="RAG-powered medical AI assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"]
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


@app.get("/")
def home():
    return {
        "name": "MedCo",
        "status": "running",
        "version": "1.0.0",
        "mode": "development"
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.post("/api/chat")
def chat(request: ChatRequest):

    question = request.message.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )

    try:
        result = generate_answer(question)

        return {
            "success": True,
            "answer": result["answer"],
            "sources": result["retrieved_sources"]
        }

    except Exception:
        logging.error("MedCo generation failed")

        raise HTTPException(
            status_code=500,
            detail="Unable to generate a response"
        )
