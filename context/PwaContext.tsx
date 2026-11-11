'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
}

declare global {
  interface Window {
    __deferredPwaPrompt__?: BeforeInstallPromptEvent | null;
  }
}

interface PwaContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isStandalone: boolean;
  isIos: boolean;
  triggerInstall: () => Promise<boolean>;
}

const PwaContext = createContext<PwaContextType>({
  deferredPrompt: null,
  isInstallable: false,
  isStandalone: false,
  isIos: false,
  triggerInstall: async () => false,
});

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect iOS
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(isIosDevice);

    // Check if running in standalone mode (already installed as WebAPK or Desktop app)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Check if top-level window already captured deferredPrompt
    if (window.__deferredPwaPrompt__) {
      setDeferredPrompt(window.__deferredPwaPrompt__);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      window.__deferredPwaPrompt__ = promptEvent;
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      if (typeof window !== 'undefined') {
        window.__deferredPwaPrompt__ = null;
      }
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async (): Promise<boolean> => {
    const promptEvent = deferredPrompt || (typeof window !== 'undefined' ? window.__deferredPwaPrompt__ : null);
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
          if (typeof window !== 'undefined') {
            window.__deferredPwaPrompt__ = null;
          }
          setIsStandalone(true);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Error triggering native PWA install prompt:', err);
        return false;
      }
    }
    return false;
  }, [deferredPrompt]);

  return (
    <PwaContext.Provider
      value={{
        deferredPrompt,
        isInstallable: !isStandalone && (!!deferredPrompt || (typeof window !== 'undefined' && !!window.__deferredPwaPrompt__)),
        isStandalone,
        isIos,
        triggerInstall,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
}

export const usePwa = () => useContext(PwaContext);

