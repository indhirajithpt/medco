# MedCo — AI Healthcare Information Assistant

MedCo is an evidence-based medical information assistant that combines Retrieval-Augmented Generation (RAG), Google Gemini 2.5 Flash-Lite, and Supabase pgvector.

It features a dark glassmorphism design system (`#050505` background, translucent panels, and subtle violet edge lighting) paired with interactive medical citations and safety safeguards.

---

## Architecture Overview

```text
                                  ┌────────────────────────┐
                                  │   Next.js 16 (React 19)│
                                  │  Dark Glassmorphic UI  │
                                  └───────────┬────────────┘
                                              │
                                    /api/proxy/chat
                                              │
                                              ▼
                                  ┌────────────────────────┐
                                  │   FastAPI Server       │
                                  │   (apps/api/main.py)   │
                                  └─────┬────────────┬─────┘
                                        │            │
            SentenceTransformer (384d)  │            │  System Instructions & Evidence
            RPC: match_medical_documents│            │  Temperature: 0.2
                                        ▼            ▼
                             ┌────────────────┐ ┌────────────────┐
                             │ Supabase       │ │ Google Gemini  │
                             │ pgvector       │ │ 2.5 Flash-Lite │
                             └────────────────┘ └────────────────┘
```

---

## Project Structure

```text
medco/
├── apps/
│   ├── api/                      # FastAPI Python Backend
│   │   ├── main.py               # REST API (/api/health, /api/chat)
│   │   ├── rag.py                # Supabase vector similarity retrieval
│   │   ├── gemini_service.py     # Gemini grounding prompt pipeline
│   │   ├── system_prompt.txt     # Medical safety & reasoning rules
│   │   ├── ingest_dataset.py     # Dataset vectorization and indexing
│   │   ├── test_conection.py     # Supabase vector connection test
│   │   ├── pyproject.toml
│   │   └── uv.lock
│   └── web/                      # Next.js App Router Frontend
│       ├── app/                  # App Router pages, layout, route proxies
│       │   ├── page.tsx          # Landing & active chat experience
│       │   ├── layout.tsx        # Global glassmorphism theme & providers
│       │   ├── loading.tsx       # Animated pulse loading state
│       │   ├── error.tsx         # Route error boundary
│       │   ├── global-error.tsx  # Root critical error boundary
│       │   ├── not-found.tsx     # Custom 404 page
│       │   ├── about/page.tsx    # Architecture and methodology
│       │   ├── settings/page.tsx # Client settings & health monitor
│       │   ├── privacy/page.tsx  # Data boundaries and privacy notice
│       │   ├── disclaimer/page.tsx # Medical disclaimer & safety
│       │   └── api/proxy/        # Server-side API proxies
│       ├── components/
│       │   ├── ui/               # PulseLogo and primitives
│       │   ├── layout/           # Header, Sidebar, Mobile Drawer
│       │   ├── landing/          # Hero, Quick Actions
│       │   ├── chat/             # MessageComposer, AssistantMessage, etc.
│       │   ├── feedback/         # ConnectionStatus, Error alerts
│       │   └── safety/           # MedicalDisclaimer, EmergencyAlert
│       ├── hooks/ & providers/   # Chat state management
│       ├── lib/                  # Centralized API client, schemas, errors
│       └── types/                # Strict TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 20+ and `pnpm`
- Python 3.10+ and `uv`

### 1. Run the Backend API

From `apps/api`:

```bash
cd apps/api
uv run uvicorn main:app --reload --port 8000
```

Verify backend health:
```bash
curl http://localhost:8000/api/health
# {"status":"healthy"}
```

### 2. Run the Frontend Web Application

From `apps/web`:

```bash
cd apps/web
pnpm install
pnpm dev
```

The web application runs at `http://localhost:3000`.

---

## Verification & Automated Tests

### Frontend Typecheck, Lint & Unit Tests

```bash
cd apps/web
pnpm exec eslint .
pnpm exec tsc --noEmit
pnpm exec vitest run
pnpm build
```

---

## Medical Safety & Development Disclaimer

MedCo is an educational prototype and is not a certified diagnostic service or medical device. All retrieved documents are currently unreviewed research materials. Do not enter personal health records or use this application to replace professional medical judgment. In case of an emergency, call 911 or local emergency services immediately.
