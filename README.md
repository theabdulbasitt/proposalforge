# ProposalForge 🚀

> AI-powered proposal generator for Upwork freelancers. Stop sending generic proposals — send a complete, professional PDF that makes you look like a senior consultant.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Groq](https://img.shields.io/badge/Groq-AI-orange)

---

## What It Does

Most Upwork freelancers send a 3-line proposal and hope for the best. ProposalForge turns a job post into two professional documents in under 60 seconds:

**Document A — The Proposal (copyable text)**
- Personalized intro referencing the client's specific project
- Your most relevant past projects auto-matched to the job
- Your tech stack
- Why you specifically are the right person
- Commitment and availability
- Professional sign-off

**Document B — The Technical Document (PDF)**
- Functional and non-functional requirements
- System architecture diagram
- Database schema (if applicable)
- Week-by-week timeline with deliverables

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| AI / Agents | Groq API (llama-3.3-70b) |
| UI Components | Shadcn/ui + TailwindCSS |
| Architecture Diagrams | Mermaid.js |
| PDF Generation | pdfmake |
| Deployment | Vercel |

---

## Features

- ✅ Supabase authentication (email + password)
- ✅ One-time freelancer profile setup (saved to account)
- ✅ Past projects management with links
- ✅ Paste any Upwork job post and generate instantly
- ✅ Smart clarification survey (5 questions, one by one)
- ✅ Multi-agent AI pipeline (6 specialized agents)
- ✅ Copyable proposal text (Document A)
- ✅ Downloadable technical PDF (Document B)
- ✅ Proposal history saved to account
- ✅ Row Level Security on all database tables

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account ([supabase.com](https://supabase.com))
- A Groq API key ([console.groq.com](https://console.groq.com))

### Installation

1. Clone the repository
```bash
git clone https://github.com/theabdulbasitt/proposalforge.git
cd proposalforge
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (see below)

4. Set up Supabase database (see Database Setup)

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the root of the project:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key_here

# Groq AI
GROQ_API_KEY=your_groq_api_key_here
```

> ⚠️ Never commit your `.env.local` file to GitHub. It is already included in `.gitignore`.

---

## Database Setup

1. Create a new project on [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `schema.sql` from this repository
4. Paste and run it in the SQL Editor
5. You should see "Success. No rows returned"

The schema creates the following tables:
- `profiles` — freelancer profile and preferences
- `past_projects` — portfolio projects with links
- `proposals` — all generated proposals with history

All tables have Row Level Security (RLS) enabled — users can only access their own data.

---

## Project Structure

```
proposalforge/
├── app/
│   ├── auth/               # Login and signup pages
│   ├── dashboard/          # Saved proposals
│   ├── profile/            # Freelancer profile setup
│   ├── new/                # New proposal generation flow
│   ├── proposal/[id]/      # View single proposal
│   └── api/                # Backend API routes
│       ├── profile/        # Profile CRUD
│       ├── proposals/      # Proposals CRUD
│       └── generate/       # Main AI agent pipeline
├── components/
│   ├── ui/                 # Shadcn components
│   ├── auth/               # Auth form components
│   ├── profile/            # Profile form components
│   └── new/                # Proposal generation flow components
├── lib/
│   ├── supabase/           # Supabase client (browser + server)
│   ├── agents/             # AI agent pipeline
│   └── pdf/                # PDF generation
├── types/                  # TypeScript type definitions
├── middleware.ts            # Route protection
└── schema.sql              # Database schema
```

---

## Agent Pipeline

ProposalForge uses a multi-agent architecture powered by Groq:

```
Job Post Input
      ↓
Clarification Agent   → identifies missing info, generates survey questions
      ↓
Matching Agent        → picks most relevant past projects for this job
      ↓
Proposal Agent        → writes Document A (personalized proposal text)
      ↓
Requirements Agent    → functional + non-functional requirements
      ↓
Architecture Agent    → generates Mermaid system diagram
      ↓
Timeline Agent        → week-by-week deliverables plan
      ↓
Compiler Agent        → assembles everything into final output
```

---

## Screenshots

*Coming soon as development progresses.*

---

## Roadmap

- [ ] Auth pages (login + signup)
- [ ] Profile setup page
- [ ] New proposal flow
- [ ] Clarification survey
- [ ] Agent pipeline
- [ ] PDF generation
- [ ] Proposal history dashboard
- [ ] Vercel deployment

---

## License

MIT

---

## Author

**Abdul Basit**
- GitHub: [@theabdulbasitt](https://github.com/theabdulbasitt)
- LinkedIn: [theabdulbasitt](https://linkedin.com/in/theabdulbasitt)