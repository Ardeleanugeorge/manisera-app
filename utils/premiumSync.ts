/**
 * Premium Sync Utility
 * 
 * Această utilitate gestionează sincronizarea statusului Premium între dispozitive.
 * 
 * Opțiuni de implementare:
 * 1. Firebase Authentication + Firestore (recomandat)
 * 2. Supabase (open source alternative)
 * 3. Custom Backend API
 * 4. Google Play Billing (pentru Android)
 */

import { getItemSync, setItemSync } from './storage';

export interface PremiumStatus {
  isPremium: boolean;
  userId: string;
  subscriptionId?: string;
  expiresAt?: number;
  plan?: 'monthly' | 'yearly';
}

// Generate unique user ID (based on device + time)
export function generateUserId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const deviceInfo = typeof navigator !== 'undefined' 
    ? (navigator.userAgent || 'web').substring(0, 10) 
    : 'mobile';
  
  return `user_${timestamp}_${random}_${deviceInfo}`;
}

// Get or create user ID
export function getUserId(): string {
  let userId = getItemSync('manisera_user_id');
  if (!userId) {
    userId = generateUserId();
    setItemSync('manisera_user_id', userId);
  }
  return userId;
}

/**
 * Get premium status from local storage
 * In production, this should sync with backend
 * 
 * IMPORTANT: Verifică expirarea OFFLINE - funcționează fără internet
 */
export function getPremiumStatus(): PremiumStatus {
  const userId = getUserId();
  const premiumData = getItemSync('manisera_premium_data');
  
  if (premiumData) {
    try {
      const data = JSON.parse(premiumData);
      // Check if expired (works offline - uses local device time)
      if (data.expiresAt && data.expiresAt < Date.now()) {
        // Premium expired - automatically downgrade
        console.log('Premium expired - downgrading to free');
        return { isPremium: false, userId, expiresAt: data.expiresAt };
      }
      return { ...data, userId };
    } catch (e) {
      console.error('Error parsing premium data:', e);
    }
  }
  
  // Fallback to simple check (for old data format)
  const isPremium = getItemSync('manisera_premium') === 'true';
  return { isPremium, userId };
}

/**
 * Save premium status locally
 * In production, this should also sync with backend
 */
export function savePremiumStatus(status: PremiumStatus): void {
  setItemSync('manisera_premium', status.isPremium ? 'true' : 'false');
  setItemSync('manisera_premium_data', JSON.stringify(status));
  
  // TODO: Sync with backend
  // syncPremiumWithBackend(status);
}

/**
 * Sync premium status with backend
 * TODO: Implement backend integration
 */
async function syncPremiumWithBackend(status: PremiumStatus): Promise<void> {
  // Example implementation with backend API
  /*
  try {
    const response = await fetch('https://api.manisera.app/premium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: status.userId,
        isPremium: status.isPremium,
        subscriptionId: status.subscriptionId,
        expiresAt: status.expiresAt,
        plan: status.plan
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync premium status');
    }
  } catch (error) {
    console.error('Error syncing premium status:', error);
    // Continue offline - data is saved locally
  }
  */
}

/**
 * Check premium status from backend
 * TODO: Implement backend check
 */
export async function checkPremiumFromBackend(userId: string): Promise<PremiumStatus | null> {
  // Example implementation
  /*
  try {
    const response = await fetch(`https://api.manisera.app/premium/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error checking premium from backend:', error);
  }
  */
  return null;
}

/**
 * Verify premium subscription (for Android Play Billing)
 */
export async function verifyAndroidSubscription(receipt: string): Promise<PremiumStatus | null> {
  // TODO: Implement Google Play Billing verification
  // This would verify the purchase with Google Play API
  return null;
}

