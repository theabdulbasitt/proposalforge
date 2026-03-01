# DevLog — ProposalForge

> Development journal — decisions, learnings, and progress.

---

**What I did**
- Initialized Next.js 14 project (TypeScript, TailwindCSS, App Router)
- Designed and ran Supabase schema (3 tables: profiles, past_projects, proposals)
- Set up Supabase browser + server clients and route protection middleware
- Installed all core dependencies

**What I learned**
- Next.js combines frontend + backend in one project — API routes replace Express
- Server vs Client components — server runs on server only, client runs in browser
- Supabase handles JWT automatically via cookies — no manual token management
- Middleware replaces ProtectedRoute pattern from React, runs before page loads
- RLS policies enforce data access at database level, not just application level
- PostgreSQL triggers auto-update `updated_at` on every row update
- Conventional commits standard — `feat:`, `fix:`, `chore:`, `docs:`

**Key decisions**
- Groq API for dev (free tier), will swap to Anthropic before final deployment
- pdfmake over Puppeteer — lighter, works on Vercel serverless
- Kept RLS even though requests go through server — second layer of security

**Commits**
```
chore: initial project setup and supabase client configuration
docs: add README and devlog
```

---