import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Proposal } from '@/types'

function timeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
}

function StatusPill({ status }: { status: Proposal['status'] }) {
    const map = {
        complete: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        generating: 'bg-blue-50 text-blue-700 ring-blue-200',
        failed: 'bg-red-50 text-red-600 ring-red-200',
        draft: 'bg-stone-100 text-stone-500 ring-stone-200',
    }
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${map[status] ?? map.draft}`}>
            {status}
        </span>
    )
}

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: proposals } = await supabase
        .from('proposals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single()

    const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
    const total = proposals?.length ?? 0
    const completed = proposals?.filter(p => p.status === 'complete').length ?? 0

    return (
        <div className="min-h-screen bg-[#FAF9F7] font-sans">

            {/* Top nav */}
            <header className="sticky top-0 z-10 bg-[#FAF9F7]/80 backdrop-blur-sm border-b border-stone-200">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-tight text-stone-800">
                        Proposal<span className="text-amber-600">Forge</span>
                    </span>
                    <div className="flex items-center gap-1">
                        <Link href="/profile">
                            <Button variant="ghost" size="sm"
                                className="text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-xs h-8">
                                Profile
                            </Button>
                        </Link>
                        <Link href="/new">
                            <Button size="sm"
                                className="bg-stone-900 hover:bg-stone-700 text-white text-xs h-8 px-4 rounded-lg">
                                New proposal
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">

                {/* Greeting + stats */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Dashboard</p>
                        <h1 className="text-2xl font-semibold text-stone-900">
                            Good to see you, {firstName}
                        </h1>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-2xl font-semibold text-stone-900">{total}</p>
                            <p className="text-xs text-stone-400 mt-0.5">Total</p>
                        </div>
                        <div className="w-px h-8 bg-stone-200" />
                        <div className="text-right">
                            <p className="text-2xl font-semibold text-emerald-600">{completed}</p>
                            <p className="text-xs text-stone-400 mt-0.5">Completed</p>
                        </div>
                    </div>
                </div>

                {/* Profile incomplete warning */}
                {!profile && (
                    <div className="flex items-center justify-between px-5 py-4 rounded-xl border border-amber-200 bg-amber-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-amber-800">Complete your profile</p>
                                <p className="text-xs text-amber-600 mt-0.5">Required to personalize your proposals.</p>
                            </div>
                        </div>
                        <Link href="/profile">
                            <Button size="sm" variant="outline"
                                className="border-amber-300 text-amber-700 hover:bg-amber-100 text-xs h-8">
                                Set up →
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Proposals section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest">
                            Recent Proposals
                        </h2>
                        {total > 0 && (
                            <span className="text-xs text-stone-400">{total} total</span>
                        )}
                    </div>

                    {/* Empty state */}
                    {total === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-stone-200 rounded-2xl bg-white/60 space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-stone-700">No proposals yet</p>
                                <p className="text-xs text-stone-400">Paste a job post and generate your first proposal in 30 seconds.</p>
                            </div>
                            <Link href="/new">
                                <Button size="sm"
                                    className="bg-stone-900 hover:bg-stone-700 text-white text-xs h-8 px-5 rounded-lg mt-1">
                                    Generate first proposal
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Proposals list */}
                    {total > 0 && (
                        <div className="rounded-xl border border-stone-200 bg-white overflow-hidden divide-y divide-stone-100">
                            {proposals!.map((proposal: Proposal) => {
                                const jobTitle = proposal.job_post?.split('\n')[0]?.slice(0, 90) || 'Untitled Proposal'
                                return (
                                    <Link key={proposal.id} href={`/proposal/${proposal.id}`}>
                                        <div className="group flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors duration-150 cursor-pointer">
                                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                                {/* Doc icon */}
                                                <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center flex-shrink-0 transition-colors">
                                                    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-stone-800 truncate">{jobTitle}</p>
                                                    <p className="text-xs text-stone-400 mt-0.5">{timeAgo(proposal.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                                <StatusPill status={proposal.status} />
                                                <svg className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-colors"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}