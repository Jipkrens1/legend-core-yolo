import { useCallback, useEffect, useRef, useState } from 'react'

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

// Intersection Observer hook for lazy loading
export function useIntersection(
  options?: IntersectionObserverInit
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [element, setElement] = useState<Element | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [element, options])

  const ref = useCallback((node: Element | null) => {
    setElement(node)
  }, [])

  return [ref, isIntersecting]
}

// Virtual list helper
export function useVirtualList<T>(
  items: T[],
  containerRef: React.RefObject<HTMLElement>,
  itemHeight: number,
  overscan = 3
) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setScrollTop(container.scrollTop)
    }

    const handleResize = () => {
      setContainerHeight(container.clientHeight)
    }

    handleResize()
    container.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [containerRef])

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const virtualItems = items.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: startIndex + index,
    style: {
      position: 'absolute' as const,
      top: (startIndex + index) * itemHeight,
      height: itemHeight,
      width: '100%',
    },
  }))

  const totalHeight = items.length * itemHeight

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
  }
}

// Memoization helper for expensive computations
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  getKey: (...args: Args) => string = (...args) => JSON.stringify(args)
): (...args: Args) => Result {
  const cache = new Map<string, Result>()

  return (...args: Args) => {
    const key = getKey(...args)
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// Performance measurement
export function measurePerformance(name: string) {
  const start = performance.now()

  return {
    end: () => {
      const duration = performance.now() - start
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      }
      return duration
    },
  }
}

// Report Web Vitals
// Note: Install 'web-vitals' package to enable: npm install web-vitals
export function reportWebVitals(onPerfEntry?: (metric: unknown) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Web Vitals can be enabled by installing the web-vitals package
    // import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    //   onCLS(onPerfEntry)
    //   onFID(onPerfEntry)
    //   onFCP(onPerfEntry)
    //   onLCP(onPerfEntry)
    //   onTTFB(onPerfEntry)
    // })
    console.log('Web Vitals reporting configured. Install web-vitals package to enable.')
  }
}
