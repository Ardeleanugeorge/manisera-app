# 🏗️ Arhitectura Aplicației Manisera

## 📱 Tipuri de Aplicații

### 1. **Web App (PWA)**
- **URL**: `https://manisera-app.vercel.app`
- **Funcționare**: Browser web optimizat
- **Storage**: `localStorage` (persistență locală)
- **Offline**: Funcționează offline (datele sunt salvate local)
- **Premium**: Salvat în `localStorage` (doar pe acel browser)

### 2. **Android App (APK)**
- **Tip**: Aplicație nativă Android (nu web app)
- **Funcționare**: React Native compilat în cod nativ
- **Storage**: `AsyncStorage` (echivalent cu localStorage)
- **Offline**: Funcționează complet offline
- **Premium**: Salvat local (AsyncStorage)

## 🔄 Funcționare Offline vs Online

### ✅ **Funcționează OFFLINE:**
- ✅ Toate afirmațiile (600 per categorie - sunt în cod)
- ✅ Onboarding și personalizare
- ✅ Progresul zilnic (completate zile, sesiuni)
- ✅ Speech recognition (folosește API-ul browserului/telefonului)
- ✅ Status Premium (salvat local)

### ⚠️ **Necesită CONEXIUNE:**
- ⚠️ Sincronizare Premium între dispozitive (dacă implementezi backend)
- ⚠️ Update-uri de conținut (dacă vrei să adaugi afirmații noi)
- ⚠️ Analytics și tracking (opțional)

## 💳 Sistem Premium - Situația Actuală

### **Status Actual:**
- Premium este salvat **local** în `localStorage` / `AsyncStorage`
- Funcționează **offline** complet
- **PROBLEMA**: Dacă utilizatorul are Premium pe un dispozitiv, nu va fi Premium pe altul

### **Soluții pentru Sincronizare Premium:**

#### **Opțiunea 1: Firebase (Recomandat)**
```javascript
// Exemplu cu Firebase
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Când utilizatorul devine Premium
await setDoc(doc(db, 'users', userId), {
  isPremium: true,
  expiresAt: timestamp,
  plan: 'monthly'
});

// La start aplicație
const userDoc = await getDoc(doc(db, 'users', userId));
if (userDoc.exists()) {
  const data = userDoc.data();
  setIsPremium(data.isPremium && data.expiresAt > Date.now());
}
```

#### **Opțiunea 2: Google Play Billing (pentru Android)**
- Pentru aplicații Android, cel mai simplu este să folosești Google Play Billing
- Google Play verifică automat subscription-ul
- Nu ai nevoie de backend propriu

#### **Opțiunea 3: Supabase (Open Source)**
- Alternativă la Firebase
- Similar cu Firebase dar open source

#### **Opțiunea 4: Custom Backend API**
- Creezi propriul backend (Node.js, Python, etc.)
- API endpoints pentru verificare Premium

## 📊 Datele Utilizatorului

### **Ce este salvat local (offline):**
```javascript
{
  // Profil utilizator
  'manisera_user_profile': {
    name, birthDate, gender, goals, experience, timePreference
  },
  
  // Premium status
  'manisera_premium': 'true' | 'false',
  'manisera_premium_data': {
    isPremium, userId, expiresAt, plan, subscriptionId
  },
  
  // Progres
  'manisera_completed_days': [1, 2, 3, ...],
  'manisera_completed_sessions_1': { morning: true, afternoon: true, ... },
  'manisera_free_progress_1': { affirmationIndex: 2, reps: 1 },
  
  // Tracking
  'manisera_last_access_date': 'Mon Nov 05 2024',
  'manisera_last_completed_day_date': 'Mon Nov 05 2024'
}
```

## 🔐 Securitate Premium

### **Problema Actuală:**
- Premium poate fi modificat manual în `localStorage`
- Nu este verificat de backend

### **Soluții:**
1. **Backend Verification**: Verifică status Premium pe server
2. **Google Play Billing**: Verifică automat cu Google
3. **JWT Tokens**: Token criptat pentru Premium
4. **Obfuscation**: Ascunde logica Premium în cod (minimă protecție)

## 🚀 Recomandări

### **Pentru MVP (Minimum Viable Product):**
- ✅ Păstrează funcționarea offline actuală
- ✅ Premium local (funcționează pe acel dispozitiv)
- ✅ Când utilizatorul devine Premium, salvează local

### **Pentru Producție:**
- 🔄 Implementează Firebase sau Google Play Billing
- 🔄 Sincronizează Premium între dispozitive
- 🔄 Verifică status Premium pe backend
- 🔄 Implementează refresh tokens pentru securitate

## 📝 Concluzie

**Aplicația funcționează COMPLET offline** - toate datele sunt salvate local.
**Premium funcționează offline** - dar este doar pe acel dispozitiv.
**Pentru sincronizare între dispozitive** - necesită backend (Firebase, Google Play, etc.)


