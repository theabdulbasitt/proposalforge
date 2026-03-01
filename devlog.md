# DevLog — ProposalForge

> Development journal — decisions, learnings, and progress.

---

## Step 1 — Project Foundation
📅 March 1, 2026

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

**Next steps**
- Build login and signup auth pages
- Harden foundation files with proper error handling

---

## Step 2 — Auth Pages & Security Hardening
📅 March 1, 2026

**What I did**
- Built login and signup pages using Shadcn/ui components
- Built auth callback route for email confirmation flow
- Audited and hardened all 3 foundation files (client.ts, server.ts, middleware.ts)

**What I learned**
- Never use `!` to silence TypeScript env variable warnings — validate explicitly with clear error messages
- Generic error messages on auth forms prevent attackers from knowing if an email exists in the system
- Empty `catch {}` blocks should always have a comment explaining why — otherwise looks like lazy coding
- Middleware should "fail open" on auth errors — better to let a request through than crash every page
- API routes need their own auth checks — middleware only protects pages, not `/api/` endpoints
- Always `disabled={loading}` on inputs during form submission — prevents editing mid-request
- `.trim().toLowerCase()` on email before sending — prevents subtle bugs from accidental whitespace
- Never trim passwords — spaces could be intentional

**Key decisions**
- Password rules: min 8 chars, one uppercase, one number — balance of security and usability
- Generic error messages on both login and signup to prevent email enumeration attacks

**Commits**
```
feat: auth pages with login signup and callback route
chore: add security hardening and error handling to supabase clients and middleware
```

**Next steps**
- Build freelancer profile setup page
- Build past projects management (add, edit, delete)

---