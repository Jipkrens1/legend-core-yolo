import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  sources?: Array<{
    type: string
    id: string
    title: string
  }>
}

export function useAIChat(projectId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true)
    setError(null)

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          type: 'chat',
          projectId,
          messages: [...messages, userMessage],
        },
      })

      if (error) throw error

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content,
      }
      setMessages(prev => [...prev, assistantMessage])

      return data as AIResponse
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Er is een fout opgetreden'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [projectId, messages])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}

export function useExtractRequirements() {
  const [isLoading, setIsLoading] = useState(false)

  const extract = useCallback(async (projectId: string, documents: string[]) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          type: 'extract-requirements',
          projectId,
          documents,
        },
      })

      if (error) throw error
      return data.requirements as Array<{
        requirement: string
        category?: string
        priority?: string
      }>
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { extract, isLoading }
}

export function useExtractActionItems() {
  const [isLoading, setIsLoading] = useState(false)

  const extract = useCallback(async (transcript: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          type: 'extract-actions',
          transcript,
        },
      })

      if (error) throw error
      return data.actions as Array<{
        title: string
        owner?: string
        deadline?: string
        priority?: string
      }>
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { extract, isLoading }
}

export function useMeetingSummary() {
  const [isLoading, setIsLoading] = useState(false)

  const summarize = useCallback(async (transcript: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          type: 'meeting-summary',
          transcript,
        },
      })

      if (error) throw error
      return data.summary as string
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { summarize, isLoading }
}

export function useProjectInsights(projectId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<{
    riskFactors: string[]
    suggestions: string[]
    healthScore: number
  } | null>(null)

  const analyze = useCallback(async () => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          type: 'project-insights',
          projectId,
        },
      })

      if (error) throw error
      setInsights(data)
      return data
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  return { insights, analyze, isLoading }
}
