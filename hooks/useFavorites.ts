"use client";

import { useState, useEffect, useCallback } from 'react';

export interface SavedItem {
  id: string;
  title: string;
  imageUrl: string;
  type: 'movie' | 'writing';
  slug?: string;
  category?: string;
  year?: number | string;
  duration?: string;
  author?: string;
  savedAt?: number;
  imageFit?: 'contain' | 'cover';
  imageZoom?: number;
  imagePosX?: number;
  imagePosY?: number;
}

const STORAGE_KEY = 'mediay_islamy_favorites_v1';
const EVENT_NAME = 'mediay_favorites_change';

export function useFavorites() {
  const [favorites, setFavorites] = useState<SavedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Synchronize state directly from browser localStorage
  const syncFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Error reading saved favorites from localStorage:', e);
    }
    setFavorites([]);
  }, []);

  // Hydration safety: read localStorage only after component mounts on client
  useEffect(() => {
    syncFromStorage();
    setIsLoaded(true);

    const handleCustomChange = () => syncFromStorage();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) syncFromStorage();
    };

    window.addEventListener(EVENT_NAME, handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [syncFromStorage]);

  const saveToStorage = (updated: SavedItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setFavorites(updated);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (err) {
      console.error('Failed to persist favorites to localStorage:', err);
    }
  };

  const isFavorite = useCallback(
    (id: string) => {
      if (!isLoaded || !id) return false;
      const cleanId = String(id).trim().toLowerCase();
      return favorites.some(
        (item) =>
          item.id.toLowerCase() === cleanId ||
          (item.slug && item.slug.toLowerCase() === cleanId)
      );
    },
    [favorites, isLoaded]
  );

  const toggleFavorite = useCallback(
    (item: SavedItem) => {
      if (!item || !item.id) return;
      const itemId = String(item.id).trim().toLowerCase();
      const itemSlug = item.slug ? String(item.slug).trim().toLowerCase() : undefined;

      const exists = favorites.some(
        (f) =>
          f.id.toLowerCase() === itemId ||
          (itemSlug && f.slug && f.slug.toLowerCase() === itemSlug) ||
          (f.slug && f.slug.toLowerCase() === itemId)
      );

      let updated: SavedItem[];
      if (exists) {
        updated = favorites.filter(
          (f) =>
            f.id.toLowerCase() !== itemId &&
            (!itemSlug || !f.slug || f.slug.toLowerCase() !== itemSlug) &&
            (!f.slug || f.slug.toLowerCase() !== itemId)
        );
      } else {
        const itemToSave: SavedItem = {
          ...item,
          savedAt: Date.now(),
        };
        updated = [itemToSave, ...favorites];
      }

      saveToStorage(updated);
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      if (!id) return;
      const cleanId = String(id).trim().toLowerCase();
      const updated = favorites.filter(
        (f) =>
          f.id.toLowerCase() !== cleanId &&
          (!f.slug || f.slug.toLowerCase() !== cleanId)
      );
      saveToStorage(updated);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    saveToStorage([]);
  }, []);

  return {
    favorites,
    favoritesCount: isLoaded ? favorites.length : 0,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    isLoaded,
  };
}

