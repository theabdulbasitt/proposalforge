import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST — add a new past project
export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get the user's profile first
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (profileError || !profile) {
            return NextResponse.json(
                { error: 'Profile not found. Please save your profile first.' },
                { status: 404 }
            )
        }

        const body = await request.json()
        const { title, description, live_link, repo_link, tech_stack } = body

        if (!title?.trim() || !description?.trim()) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            )
        }

        const { data: project, error } = await supabase
            .from('past_projects')
            .insert({
                profile_id: profile.id,
                title: title.trim(),
                description: description.trim(),
                live_link: live_link?.trim() || null,
                repo_link: repo_link?.trim() || null,
                tech_stack: tech_stack || [],
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ project })

    } catch (error) {
        console.error('POST /api/profile/projects error:', error)
        return NextResponse.json(
            { error: 'Failed to add project' },
            { status: 500 }
        )
    }
}

// DELETE — remove a past project
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const projectId = searchParams.get('id')

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            )
        }

        // RLS ensures user can only delete their own projects
        const { error } = await supabase
            .from('past_projects')
            .delete()
            .eq('id', projectId)

        if (error) throw error

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('DELETE /api/profile/projects error:', error)
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        )
    }
}