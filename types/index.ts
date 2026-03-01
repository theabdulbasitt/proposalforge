export type Profile = {
    id: string
    user_id: string
    full_name: string
    title: string
    hourly_rate: number | null
    bio: string
    skills: string[]
    timezone: string
    availability_hours: string
    created_at: string
    updated_at: string
}

export type PastProject = {
    id: string
    profile_id: string
    title: string
    description: string
    live_link: string | null
    repo_link: string | null
    tech_stack: string[]
    created_at: string
}

export type Proposal = {
    id: string
    user_id: string
    job_post: string
    clarification_answers: Record<string, string>
    proposal_text: string | null
    technical_content: Record<string, unknown>
    status: 'draft' | 'generating' | 'complete' | 'failed'
    created_at: string
    updated_at: string
}