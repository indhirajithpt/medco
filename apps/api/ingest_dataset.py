
import os
import csv
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SECRET_KEY"]
)

dataset_path = (
    Path(__file__).resolve().parents[2]
    / "output"
    / "provenance.csv"
)

# Select factual medical training records only
with open(dataset_path, encoding="utf-8") as file:
    rows = [
        row for row in csv.DictReader(file)
        if row["split"] == "train"
        and row["source"] == "MedQuAD"
    ]

print(f"Found {len(rows)} medical documents")

# Load local embedding model
print("Loading embedding model...")

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)

# Generate embeddings
texts = [
    row["question"] + "\n" + row["answer"]
    for row in rows
]

embeddings = model.encode(
    texts,
    normalize_embeddings=True,
    show_progress_bar=True
)

# Prepare database records
documents = []

for row, embedding in zip(rows, embeddings):
    documents.append({
        "document_id": row["id"],
        "question": row["question"],
        "answer": row["answer"],
        "category": row["category"],
        "source": row["source"],
        "source_url": row["source_url"],
        "source_record": row["source_record"],
        "review_status": "pending",
        "embedding": embedding.tolist()
    })

# Upload in batches
batch_size = 50

for i in range(0, len(documents), batch_size):
    batch = documents[i:i + batch_size]

    supabase.table("medical_documents").upsert(
        batch,
        on_conflict="document_id"
    ).execute()

    print(f"Uploaded {i + len(batch)}/{len(documents)}")

print("Dataset ingestion completed!")
