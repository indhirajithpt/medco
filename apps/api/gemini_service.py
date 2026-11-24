
import os
import json
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

from rag import retrieve_documents

load_dotenv()

client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"]
)

MODEL = os.environ["GEMINI_MODEL"]

SYSTEM_PROMPT = (
    Path(__file__).parent / "system_prompt.txt"
).read_text(encoding="utf-8")


def generate_answer(question):

    # Development testing only: unreviewed documents
    documents = retrieve_documents(
        question,
        limit=5,
        approved_only=False
    )

    references = []

    for i, doc in enumerate(documents, start=1):
        references.append({
            "reference": i,
            "question": doc["question"],
            "answer": doc["answer"],
            "source": doc["source_url"]
        })

    prompt = json.dumps({
        "user_question": question,
        "medical_references": references
    }, ensure_ascii=False)

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.2,
            max_output_tokens=2048
        )
    )

    return {
        "answer": response.text,
        "retrieved_sources": references
    }


if __name__ == "__main__":

    question = input("Ask MedCo: ")

    result = generate_answer(question)

    print("\nMedCo:")
    print(result["answer"])

    print("\nRetrieved references:")

    for source in result["retrieved_sources"]:
        print(source["reference"], source["source"])
