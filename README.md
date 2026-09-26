# AI Content Analyser

**Know if an image is real — before you trust it.**

A full-stack, production-deployed application that detects AI-generated images using a CLIP-based vision pipeline, with secure Google OAuth2 authentication, cloud image storage, and a polished, minimal SaaS frontend.

🔗 **Live app:** [ai-content-analyser-ecru.vercel.app](https://ai-content-analyser-ecru.vercel.app)
🔗 **Source:** [github.com/yajatsuri/ai-content-analyser](https://github.com/yajatsuri/ai-content-analyser)

---

## Why this project

Most portfolio projects stop at `localhost:3000`. This one is **live in production**, handling real traffic across a multi-service architecture spanning three cloud providers — with the operational work (HTTPS, reverse proxying, IAM key rotation, CORS, auth token handoff) that separates "I built an app" from "I can ship and run a system."

---

## Architecture

```
┌─────────────────┐      HTTPS       ┌──────────────────────────────┐
│   Next.js 16     │ ───────────────▶│   Nginx (reverse proxy, TLS)  │
│   (Vercel)       │                  │   Let's Encrypt / Certbot     │
└─────────────────┘                  └──────────────┬─────────────────┘
                                                      │
                                       ┌──────────────▼─────────────────┐
                                       │   Spring Boot 3.5 (Java 21)     │
                                       │   OAuth2 + JWT · REST API        │
                                       │   Dockerized · EC2 (Elastic IP)  │
                                       └────┬──────────────┬─────────────┘
                                            │              │
                              ┌─────────────▼───┐   ┌──────▼───────────────┐
                              │  FastAPI ML       │   │  PostgreSQL (RDS)     │
                              │  CLIP + LogReg     │   │  User + analysis data │
                              │  Docker container   │   └───────────────────┘
                              └───────────────────┘
                                            │
                                   ┌────────▼────────┐
                                   │   AWS S3          │
                                   │   Image storage    │
                                   └───────────────────┘
```

**Auth flow:** Google OAuth2 → Spring Security issues JWT → stored client-side → attached via Axios interceptor on every API call → validated on each protected request.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router, Turbopack), TypeScript, Tailwind, Framer Motion |
| Backend | Spring Boot 3.5, Java 21, Spring Security (OAuth2 + JWT), Spring Data JPA |
| ML Service | FastAPI, Hugging Face CLIP, scikit-learn logistic regression |
| Database | PostgreSQL (AWS RDS) |
| Storage | AWS S3 |
| Infra | EC2 (Docker Compose, Elastic IP), Nginx reverse proxy, Let's Encrypt TLS |
| Frontend Hosting | Vercel |
| Auth | Google OAuth2, JWT (stateless) |

---

## Engineering Highlights

**End-to-end HTTPS on a raw EC2 instance.** Configured Nginx as a TLS-terminating reverse proxy in front of Spring Boot, issued and auto-renewing Let's Encrypt certificates via Certbot, and solved the classic `X-Forwarded-Proto` trust gap in Spring Security (`server.forward-headers-strategy=framework`) so OAuth redirect URIs correctly resolve to `https://` behind the proxy.

**Zero-downtime credential rotation.** Rotated exposed AWS IAM keys and Google OAuth client secrets in production without breaking the live app — using multi-secret support to cut over cleanly before revoking the old credentials.

**Static networking on a dynamic-IP instance.** Diagnosed that every EC2 stop/start cycle broke five interdependent configs (Nginx, SSL cert domain, Spring `base-url`, OAuth redirect URI, frontend env var). Solved permanently by allocating and associating an AWS Elastic IP.

**Debugged a silent auth failure across three services.** Traced a `401 Unauthorized` on image analysis through the full request lifecycle — from a CORS preflight rejection, to a `Mixed Content` block (HTTP API called from an HTTPS frontend), to a stale JWT — using browser DevTools Network inspection and structured backend log tracing.

**Type-safe CI discipline.** Caught and fixed a Base UI / Tailwind `className` render-prop type mismatch that was silently failing Vercel's TypeScript build step, without changing the component's visual behavior.

---

## Features

- 🔐 Google OAuth2 login with stateless JWT sessions
- 🖼️ Drag-and-drop image upload (PNG/JPG/WEBP/GIF, up to 10MB)
- 🤖 CLIP-embedding-based AI vs. Real classification with confidence score
- 📊 Per-user analysis history, persisted in PostgreSQL
- ☁️ Direct-to-S3 image storage with per-user isolation
- 🎨 Minimal, animated SaaS-style UI (Framer Motion scan-beam effect)

---

## Known Limitations & Roadmap

Honest engineering means naming what's next, not hiding it:

- **Model generalization:** the current CLIP + logistic regression baseline shows reduced accuracy on casual, real-world photography (phone shots, group photos, varied lighting/compression) — it currently over-indexes on the AI-generated class. **v2 roadmap:** expand the "real" training set with diverse everyday photography, add multi-generator coverage to the AI class, and evaluate fine-tuning CLIP's projection head instead of a frozen linear probe.
- **Confidence calibration:** raw softmax/logistic outputs aren't yet calibrated (e.g. Platt scaling) — a stated 94% confidence doesn't currently map to a true 94% empirical accuracy.

---

## Running Locally

```bash
# Backend
cd src && ./mvnw spring-boot:run

# ML service
cd ml-service && uvicorn app.main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

Requires: Java 21, Python 3.11+, Node 18+, PostgreSQL, AWS credentials with S3 access, Google OAuth2 client credentials.

---

## Author

**Yajat Suri** — B.Tech CSE (Big Data Analytics), NSUT East Campus '28
[LinkedIn](https://www.linkedin.com/in/yajat-suri/) · [GitHub](https://github.com/yajatsuri) · yajatsuri2909@gmail.com
