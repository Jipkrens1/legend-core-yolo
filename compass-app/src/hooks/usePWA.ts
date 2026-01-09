import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setIsInstalled(isStandalone)

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
      setIsInstallable(false)
    }

    setDeferredPrompt(null)
    return outcome === 'accepted'
  }

  return {
    isInstallable,
    isInstalled,
    install,
  }
}

export function useServiceWorker() {
  const [isSupported, setIsSupported] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    const isSupported = 'serviceWorker' in navigator
    setIsSupported(isSupported)

    if (!isSupported) return

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        setRegistration(reg)

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true)
            }
          })
        })
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error)
      })

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }, [])

  const update = () => {
    if (!registration?.waiting) return

    // Tell waiting SW to take over
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  return {
    isSupported,
    registration,
    updateAvailable,
    update,
  }
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    const isSupported = 'Notification' in window && 'PushManager' in window
    setIsSupported(isSupported)

    if (isSupported) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return false

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }

  const subscribe = async (registration: ServiceWorkerRegistration) => {
    if (!isSupported || permission !== 'granted') return null

    try {
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // Replace with your VAPID public key
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      })
      setSubscription(sub)
      return sub
    } catch (error) {
      console.error('Push subscription failed:', error)
      return null
    }
  }

  const unsubscribe = async () => {
    if (!subscription) return

    await subscription.unsubscribe()
    setSubscription(null)
  }

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
  }
}
