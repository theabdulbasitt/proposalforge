"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Profile, PastProject } from '@/types'

const TIMEZONES = [
    'UTC', 'EST (UTC-5)', 'CST (UTC-6)', 'MST (UTC-7)', 'PST (UTC-8)',
    'GMT (UTC+0)', 'CET (UTC+1)', 'IST (UTC+5:30)', 'PKT (UTC+5)',
    'JST (UTC+9)', 'AEST (UTC+10)'
]

const AVAILABILITY = ['4 hours/day', '8 hours/day', 'Flexible']

export default function ProfilePage() {
    const router = useRouter()

    // Profile state
    const [fullName, setFullName] = useState('')
    const [title, setTitle] = useState('')
    const [hourlyRate, setHourlyRate] = useState('')
    const [bio, setBio] = useState('')
    const [timezone, setTimezone] = useState('')
    const [availability, setAvailability] = useState('')
    const [skillInput, setSkillInput] = useState('')
    const [skills, setSkills] = useState<string[]>([])

    // Past projects state
    const [projects, setProjects] = useState<PastProject[]>([])
    const [projectTitle, setProjectTitle] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [projectLiveLink, setProjectLiveLink] = useState('')
    const [projectRepoLink, setProjectRepoLink] = useState('')
    const [projectTechInput, setProjectTechInput] = useState('')
    const [projectTechStack, setProjectTechStack] = useState<string[]>([])

    // UI state
    const [loading, setLoading] = useState(false)
    const [fetchingProfile, setFetchingProfile] = useState(true)
    const [addingProject, setAddingProject] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Fetch existing profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile')
                const data = await res.json()

                if (data.profile) {
                    setFullName(data.profile.full_name || '')
                    setTitle(data.profile.title || '')
                    setHourlyRate(data.profile.hourly_rate?.toString() || '')
                    setBio(data.profile.bio || '')
                    setTimezone(data.profile.timezone || '')
                    setAvailability(data.profile.availability_hours || '')
                    setSkills(data.profile.skills || [])
                }

                if (data.projects) {
                    setProjects(data.projects)
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err)
            } finally {
                setFetchingProfile(false)
            }
        }

        fetchProfile()
    }, [])

    // Add skill tag
    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault()
            const skill = skillInput.trim()
            if (!skills.includes(skill)) {
                setSkills([...skills, skill])
            }
            setSkillInput('')
        }
    }

    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill))
    }

    // Add project tech tag
    const handleAddProjectTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && projectTechInput.trim()) {
            e.preventDefault()
            const tech = projectTechInput.trim()
            if (!projectTechStack.includes(tech)) {
                setProjectTechStack([...projectTechStack, tech])
            }
            setProjectTechInput('')
        }
    }

    const handleRemoveProjectTech = (tech: string) => {
        setProjectTechStack(projectTechStack.filter(t => t !== tech))
    }

    // Save profile
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    title,
                    hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
                    bio,
                    skills,
                    timezone,
                    availability_hours: availability,
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Failed to save profile')
                return
            }

            setSuccess('Profile saved successfully')
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Add past project
    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddingProject(true)
        setError('')

        try {
            const res = await fetch('/api/profile/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: projectTitle,
                    description: projectDescription,
                    live_link: projectLiveLink || null,
                    repo_link: projectRepoLink || null,
                    tech_stack: projectTechStack,
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Failed to add project')
                return
            }

            setProjects([data.project, ...projects])

            // Reset project form
            setProjectTitle('')
            setProjectDescription('')
            setProjectLiveLink('')
            setProjectRepoLink('')
            setProjectTechStack([])
            setProjectTechInput('')

        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setAddingProject(false)
        }
    }

    // Delete past project
    const handleDeleteProject = async (projectId: string) => {
        try {
            const res = await fetch(`/api/profile/projects?id=${projectId}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                setError('Failed to delete project')
                return
            }

            setProjects(projects.filter(p => p.id !== projectId))
        } catch (err) {
            setError('Something went wrong. Please try again.')
        }
    }

    if (fetchingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
                    <p className="text-gray-500 mt-1">
                        This information is used to personalize every proposal you generate.
                    </p>
                </div>

                {/* Profile Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Fill this out once — it's reused in every proposal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveProfile} className="space-y-5">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Abdul Basit"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Full Stack Developer"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                                <Input
                                    id="hourlyRate"
                                    type="number"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(e.target.value)}
                                    placeholder="30"
                                    disabled={loading}
                                    min="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Brief intro about yourself and your experience..."
                                    disabled={loading}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="skills">Skills</Label>
                                <Input
                                    id="skills"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    placeholder="Type a skill and press Enter (e.g. React)"
                                    disabled={loading}
                                />
                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {skills.map(skill => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                                                onClick={() => handleRemoveSkill(skill)}
                                            >
                                                {skill} ×
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-gray-400">Press Enter to add. Click a skill to remove it.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <select
                                        id="timezone"
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                        disabled={loading}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Select timezone</option>
                                        {TIMEZONES.map(tz => (
                                            <option key={tz} value={tz}>{tz}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="availability">Availability</Label>
                                    <select
                                        id="availability"
                                        value={availability}
                                        onChange={(e) => setAvailability(e.target.value)}
                                        disabled={loading}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Select availability</option>
                                        {AVAILABILITY.map(a => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}
                            {success && <p className="text-sm text-green-600">{success}</p>}

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Saving...' : 'Save Profile'}
                            </Button>

                        </form>
                    </CardContent>
                </Card>

                <Separator />

                {/* Past Projects */}
                <Card>
                    <CardHeader>
                        <CardTitle>Past Projects</CardTitle>
                        <CardDescription>
                            Add your best work. The AI will pick the most relevant ones for each proposal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Existing projects list */}
                        {projects.length > 0 && (
                            <div className="space-y-3">
                                {projects.map(project => (
                                    <div
                                        key={project.id}
                                        className="p-4 border rounded-lg bg-white space-y-2"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{project.title}</p>
                                                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteProject(project.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {project.tech_stack.map(tech => (
                                                <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 text-xs text-gray-400">
                                            {project.live_link && (
                                                <a href={project.live_link} target="_blank" rel="noopener noreferrer"
                                                    className="hover:text-blue-500">
                                                    Live Link ↗
                                                </a>
                                            )}
                                            {project.repo_link && (
                                                <a href={project.repo_link} target="_blank" rel="noopener noreferrer"
                                                    className="hover:text-blue-500">
                                                    Repository ↗
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add project form */}
                        <form onSubmit={handleAddProject} className="space-y-4 border-t pt-4">
                            <p className="text-sm font-medium text-gray-700">Add a Project</p>

                            <div className="space-y-2">
                                <Label htmlFor="projectTitle">Project Title *</Label>
                                <Input
                                    id="projectTitle"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    placeholder="NeuroAssess"
                                    disabled={addingProject}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectDescription">Description * (1-2 lines)</Label>
                                <Textarea
                                    id="projectDescription"
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    placeholder="AI-powered student support platform for neurodivergent students..."
                                    disabled={addingProject}
                                    rows={2}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="projectLiveLink">Live Link</Label>
                                    <Input
                                        id="projectLiveLink"
                                        value={projectLiveLink}
                                        onChange={(e) => setProjectLiveLink(e.target.value)}
                                        placeholder="https://..."
                                        disabled={addingProject}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="projectRepoLink">Repository Link</Label>
                                    <Input
                                        id="projectRepoLink"
                                        value={projectRepoLink}
                                        onChange={(e) => setProjectRepoLink(e.target.value)}
                                        placeholder="https://github.com/..."
                                        disabled={addingProject}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectTech">Tech Stack</Label>
                                <Input
                                    id="projectTech"
                                    value={projectTechInput}
                                    onChange={(e) => setProjectTechInput(e.target.value)}
                                    onKeyDown={handleAddProjectTech}
                                    placeholder="Type a technology and press Enter"
                                    disabled={addingProject}
                                />
                                {projectTechStack.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {projectTechStack.map(tech => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                                                onClick={() => handleRemoveProjectTech(tech)}
                                            >
                                                {tech} ×
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button type="submit" variant="outline" disabled={addingProject} className="w-full">
                                {addingProject ? 'Adding...' : '+ Add Project'}
                            </Button>
                        </form>

                    </CardContent>
                </Card>

                {/* Continue to dashboard */}
                <Button
                    onClick={() => router.push('/dashboard')}
                    className="w-full"
                >
                    Continue to Dashboard →
                </Button>

            </div>
        </div>
    )
}