"use client"

import { useEffect, useState } from 'react'

type Step = {
    id: string
    label: string
    sublabel?: string
}

type AgentLoaderProps = {
    steps: Step[]
    currentStep: number
    title?: string
}

export function AgentLoader({ steps, currentStep, title = "Generating your proposal..." }: AgentLoaderProps) {
    const [dots, setDots] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.')
        }, 400)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-10">

                {/* Title */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping [animation-delay:150ms]" />
                        <div className="w-2 h-2 rounded-full bg-blue-300 animate-ping [animation-delay:300ms]" />
                    </div>
                    <h2 className="text-white text-2xl font-semibold tracking-tight">
                        {title}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        This takes about 20–30 seconds{dots}
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                    {steps.map((step, index) => {
                        const isDone = index < currentStep
                        const isActive = index === currentStep
                        const isPending = index > currentStep

                        return (
                            <div
                                key={step.id}
                                className={`
                  flex items-center gap-4 p-4 rounded-xl border transition-all duration-500
                  ${isDone ? 'bg-gray-900 border-gray-800 opacity-60' : ''}
                  ${isActive ? 'bg-gray-900 border-blue-500/50 shadow-lg shadow-blue-500/10' : ''}
                  ${isPending ? 'bg-gray-900/40 border-gray-800/50 opacity-30' : ''}
                `}
                            >
                                {/* Icon */}
                                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                  ${isDone ? 'bg-green-500/20' : ''}
                  ${isActive ? 'bg-blue-500/20' : ''}
                  ${isPending ? 'bg-gray-800' : ''}
                `}>
                                    {isDone && (
                                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {isActive && (
                                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                                    )}
                                    {isPending && (
                                        <div className="w-2 h-2 rounded-full bg-gray-600" />
                                    )}
                                </div>

                                {/* Label */}
                                <div className="flex-1 min-w-0">
                                    <p className={`
                    text-sm font-medium transition-colors duration-300
                    ${isDone ? 'text-gray-400' : ''}
                    ${isActive ? 'text-white' : ''}
                    ${isPending ? 'text-gray-600' : ''}
                  `}>
                                        {step.label}
                                    </p>
                                    {step.sublabel && isActive && (
                                        <p className="text-xs text-blue-400 mt-0.5 animate-pulse">
                                            {step.sublabel}
                                        </p>
                                    )}
                                </div>

                                {/* Active spinner */}
                                {isActive && (
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="w-4 h-4 text-blue-400 animate-spin"
                                            fill="none" viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25" cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                    </div>
                                )}

                                {/* Done checkmark animation */}
                                {isDone && (
                                    <div className="flex-shrink-0 text-green-400 text-xs font-medium">
                                        Done
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Bottom progress bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>Progress</span>
                        <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1">
                        <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}