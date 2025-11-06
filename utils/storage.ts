/**
 * Storage utility that works on both web (localStorage) and native (AsyncStorage)
 * This provides a unified API for persistent storage across platforms
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Check if we're on web platform
const isWeb = Platform.OS === 'web';

// Cache for synchronous access on native platforms
const storageCache: { [key: string]: string | null } = {};
let cacheInitialized = false;

// Initialize cache by loading all keys from AsyncStorage
async function initializeCache() {
  if (isWeb || cacheInitialized) return;
  
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(allKeys);
    values.forEach(([key, value]) => {
      storageCache[key] = value;
    });
    cacheInitialized = true;
  } catch (error) {
    console.error('Error initializing storage cache:', error);
  }
}

// Initialize cache on import (for native)
if (!isWeb) {
  initializeCache();
}

/**
 * Get item from storage
 */
export async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    // Use localStorage on web
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  } else {
    // Use AsyncStorage on native
    try {
      const value = await AsyncStorage.getItem(key);
      // Update cache
      storageCache[key] = value;
      return value;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }
}

/**
 * Set item in storage
 */
export async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    // Use localStorage on web
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } else {
    // Use AsyncStorage on native
    try {
      await AsyncStorage.setItem(key, value);
      // Update cache
      storageCache[key] = value;
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }
}

/**
 * Remove item from storage
 */
export async function removeItem(key: string): Promise<void> {
  if (isWeb) {
    // Use localStorage on web
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } else {
    // Use AsyncStorage on native
    try {
      await AsyncStorage.removeItem(key);
      // Update cache
      delete storageCache[key];
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }
}

/**
 * Clear all items from storage
 */
export async function clear(): Promise<void> {
  if (isWeb) {
    // Use localStorage on web
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  } else {
    // Use AsyncStorage on native
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

/**
 * Synchronous version for getItem (for compatibility with existing code)
 * On native, uses cache that's populated asynchronously
 */
export function getItemSync(key: string): string | null {
  if (isWeb) {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  } else {
    // On native, use cache
    // If cache not initialized yet, try to get it (will be null initially)
    if (!cacheInitialized) {
      // Try to initialize cache synchronously (won't work, but we'll return cached value)
      initializeCache();
    }
    return storageCache[key] ?? null;
  }
}

/**
 * Synchronous version for setItem (for compatibility with existing code)
 * On native, updates cache immediately and queues async operation
 */
export function setItemSync(key: string, value: string): void {
  if (isWeb) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } else {
    // Update cache immediately
    storageCache[key] = value;
    // Queue the async operation
    AsyncStorage.setItem(key, value).catch(error => {
      console.error('Error setting item in storage (async):', error);
    });
  }
}

/**
 * Synchronous version for removeItem (for compatibility with existing code)
 */
export function removeItemSync(key: string): void {
  if (isWeb) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } else {
    // Update cache immediately
    delete storageCache[key];
    // Queue the async operation
    AsyncStorage.removeItem(key).catch(error => {
      console.error('Error removing item from storage (async):', error);
    });
  }
}


