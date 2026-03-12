import { useState, useEffect, useRef } from 'react';
import { generateArticleImage, checkQuotaStatus } from './gemini';

// Persistent cache key
const CACHE_KEY = 'bhp_finance_image_cache';

// Load cache from localStorage
const loadCache = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

// Save cache to localStorage with size management
const saveCache = (cache: Record<string, string>) => {
  try {
    // Basic size management: if cache gets too big, clear it
    // localStorage is usually 5MB. Base64 images are large.
    // We'll keep only the last 10 images to be safe.
    const keys = Object.keys(cache);
    if (keys.length > 10) {
      const newCache: Record<string, string> = {};
      keys.slice(-10).forEach(k => {
        newCache[k] = cache[k];
      });
      localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
    } else {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  } catch (e) {
    console.warn("Failed to save image cache to localStorage", e);
  }
};

let imageCache: Record<string, string> = loadCache();

export function useSmartImage(initialSrc: string, title: string, category: string) {
  const [src, setSrc] = useState(initialSrc);
  const [isLoading, setIsLoading] = useState(false);
  const attemptedRef = useRef(false);

  const refreshImage = async () => {
    const cacheKey = `${title}-${category}`;
    setIsLoading(true);
    try {
      const generated = await generateArticleImage(title, category);
      if (generated) {
        imageCache[cacheKey] = generated;
        saveCache(imageCache);
        setSrc(generated);
      }
    } catch (err) {
      console.error("Hook error refreshing image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isPlaceholder = initialSrc.includes('picsum.photos') || 
                         initialSrc.includes('placeholder.com') ||
                         !initialSrc;
    const cacheKey = `${title}-${category}`;
    
    // If we have it in cache, use it immediately
    if (isPlaceholder && imageCache[cacheKey]) {
      setSrc(imageCache[cacheKey]);
      return;
    }

    // If quota is already known to be exceeded, don't even try
    if (isPlaceholder && checkQuotaStatus()) {
      return;
    }
    
    if (isPlaceholder && !attemptedRef.current) {
      const generate = async () => {
        attemptedRef.current = true;
        setIsLoading(true);
        try {
          const generated = await generateArticleImage(title, category);
          if (generated) {
            imageCache[cacheKey] = generated;
            saveCache(imageCache);
            setSrc(generated);
          }
        } catch (err) {
          console.error("Hook error generating image:", err);
        } finally {
          setIsLoading(false);
        }
      };
      generate();
    }
  }, [initialSrc, title, category]);

  return { src, isLoading, refreshImage };
}
