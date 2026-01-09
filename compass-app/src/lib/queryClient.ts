import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { toast } from 'sonner'

// Create optimized query client with caching strategies
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Cache data for 30 minutes
      gcTime: 1000 * 60 * 30,
      // Retry failed requests up to 3 times
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for real-time feel
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show error toast if data was previously cached
      if (query.state.data !== undefined) {
        toast.error(`Fout bij verversen: ${error.message}`)
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(`Fout: ${error.message}`)
    },
  }),
})

// Prefetch common queries
export async function prefetchCommonQueries() {
  // Prefetch will be called after auth is confirmed
  await queryClient.prefetchQuery({
    queryKey: ['projects'],
    staleTime: 1000 * 60 * 5,
  })
}

// Optimistic update helpers
export function optimisticUpdate<T>(
  queryKey: unknown[],
  updater: (old: T | undefined) => T
) {
  const previousData = queryClient.getQueryData<T>(queryKey)
  queryClient.setQueryData<T>(queryKey, updater)
  return previousData
}

export function rollbackUpdate<T>(queryKey: unknown[], previousData: T | undefined) {
  queryClient.setQueryData<T>(queryKey, previousData)
}

// Batch invalidation helper
export function invalidateRelatedQueries(entityType: string, entityId?: string) {
  const invalidations: Promise<void>[] = []

  switch (entityType) {
    case 'project':
      invalidations.push(
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['projects', entityId] })
      )
      break
    case 'action_item':
      invalidations.push(
        queryClient.invalidateQueries({ queryKey: ['action-items'] })
      )
      break
    case 'meeting':
      invalidations.push(
        queryClient.invalidateQueries({ queryKey: ['meetings'] })
      )
      break
    case 'stakeholder':
      invalidations.push(
        queryClient.invalidateQueries({ queryKey: ['stakeholders'] })
      )
      break
    case 'decision':
      invalidations.push(
        queryClient.invalidateQueries({ queryKey: ['decisions'] })
      )
      break
  }

  return Promise.all(invalidations)
}
