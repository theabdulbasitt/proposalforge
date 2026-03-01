import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET — fetch profile + past projects
export async function GET() {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 = no rows found, which is fine for new users
            throw profileError
        }

        if (!profile) {
            return NextResponse.json({ profile: null, projects: [] })
        }

        const { data: projects, error: projectsError } = await supabase
            .from('past_projects')
            .select('*')
            .eq('profile_id', profile.id)
            .order('created_at', { ascending: false })

        if (projectsError) throw projectsError

        return NextResponse.json({ profile, projects: projects || [] })

    } catch (error) {
        console.error('GET /api/profile error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

// POST — create or update profile
export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { full_name, title, hourly_rate, bio, skills, timezone, availability_hours } = body

        // Validate required fields
        if (!full_name?.trim() || !title?.trim()) {
            return NextResponse.json(
                { error: 'Full name and title are required' },
                { status: 400 }
            )
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .upsert({
                user_id: user.id,
                full_name: full_name.trim(),
                title: title.trim(),
                hourly_rate: hourly_rate || null,
                bio: bio?.trim() || '',
                skills: skills || [],
                timezone: timezone?.trim() || '',
                availability_hours: availability_hours?.trim() || '',
            }, { onConflict: 'user_id' })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ profile })

    } catch (error) {
        console.error('POST /api/profile error:', error)
        return NextResponse.json(
            { error: 'Failed to save profile' },
            { status: 500 }
        )
    }
}