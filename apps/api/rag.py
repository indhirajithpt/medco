import os

from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SECRET_KEY"]
)

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)


def retrieve_documents(question, limit=5, approved_only=True):

    embedding = model.encode(
        question,
        normalize_embeddings=True
    ).tolist()

    response = supabase.rpc(
        "match_medical_documents",
        {
            "query_embedding": embedding,
            "match_count": limit,
            "match_threshold": 0.4,
            "approved_only": approved_only
        }
    ).execute()

    return response.data


if __name__ == "__main__":

    question = input("Enter medical question: ")

    # Draft retrieval testing only
    documents = retrieve_documents(
        question,
        approved_only=False
    )

    for doc in documents:
        print("\nQuestion:", doc["question"])
        print("Answer:", doc["answer"])
        print("Source:", doc["source_url"])
        print("Similarity:", doc["similarity"])
        print("-" * 50)