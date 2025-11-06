/**
 * Storage utility that works on both web (localStorage) and native (AsyncStorage)
 * This provides a unified API for persistent storage across platforms
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Check if we're on web platform
const isWeb = Platform.OS === 'web';

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
      return await AsyncStorage.getItem(key);
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
 * WARNING: On native, this will return null initially and update asynchronously
 * Use the async version when possible
 */
export function getItemSync(key: string): string | null {
  if (isWeb) {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  } else {
    // On native, we can't do synchronous reads
    // This is a limitation - the caller should use async version
    // For now, return null and log a warning
    console.warn('getItemSync called on native platform - use async getItem instead');
    return null;
  }
}

/**
 * Synchronous version for setItem (for compatibility with existing code)
 * WARNING: On native, this will queue the operation
 * Use the async version when possible
 */
export function setItemSync(key: string, value: string): void {
  if (isWeb) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } else {
    // On native, queue the async operation
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
    // On native, queue the async operation
    AsyncStorage.removeItem(key).catch(error => {
      console.error('Error removing item from storage (async):', error);
    });
  }
}

