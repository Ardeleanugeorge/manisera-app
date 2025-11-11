# 🚀 Ghid Complet: APK vs PWA vs App Store

## 📱 Diferențe Fundamentale

### **PWA (Progressive Web App)**
- ✅ **Ce este**: Aplicație web care se comportă ca o aplicație nativă
- ✅ **Instalare**: Direct din browser (Chrome, Safari)
- ✅ **Platforme**: Android (Chrome), iOS (Safari), Desktop
- ✅ **Avantaje**: 
  - Instalare instantanee, fără store-uri
  - Actualizări automate
  - Nu necesită aprobare de la Google/Apple
  - Funcționează offline (cu service worker)
- ❌ **Dezavantaje**:
  - Nu poți vinde direct în Google Play / App Store
  - Plățile trebuie procesate prin Stripe/PayPal (nu Google Play Billing / Apple IAP)
  - Funcționalități native limitate

### **APK (Android Package)**
- ✅ **Ce este**: Fișier instalabil pentru Android
- ✅ **Instalare**: Manual sau prin Google Play
- ✅ **Platforme**: Doar Android
- ✅ **Avantaje**:
  - Acces complet la funcționalități native Android
  - Poți publica pe Google Play
  - Poți folosi Google Play Billing pentru plăți
  - Funcționează offline complet
- ❌ **Dezavantaje**:
  - Necesită aprobare Google Play
  - Actualizări prin store (sau manual)
  - Proces de review (1-3 zile)

### **IPA (iOS App)**
- ✅ **Ce este**: Fișier instalabil pentru iOS
- ✅ **Instalare**: Doar prin App Store (sau TestFlight pentru beta)
- ✅ **Platforme**: Doar iOS/iPadOS
- ✅ **Avantaje**:
  - Acces complet la funcționalități native iOS
  - Poți publica pe App Store
  - Poți folosi Apple In-App Purchase pentru plăți
  - Funcționează offline complet
- ❌ **Dezavantaje**:
  - Necesită aprobare Apple (proces strict)
  - Review process (1-7 zile)
  - Necesită cont de dezvoltator Apple ($99/an)

---

## 💰 Strategii de Monetizare pe Fiecare Platformă

### **1. PWA (Web) - Plăți Directe**

#### **Cum funcționează:**
- Utilizatorul plătește direct pe site-ul tău
- Folosești **Stripe** sau **PayPal** pentru procesare
- Nu treci prin Google Play / App Store
- **Tu primești 100% din venit** (minus taxele Stripe ~2.9% + €0.30)

#### **Implementare:**
```javascript
// Folosești Stripe Checkout sau Payment Element
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_live_...');
const { error } = await stripe.redirectToCheckout({
  lineItems: [{ price: 'price_monthly', quantity: 1 }],
  mode: 'subscription',
});
```

#### **Avantaje:**
- ✅ Control complet asupra plăților
- ✅ Comisioane mai mici (2.9% vs 15-30%)
- ✅ Nu depinzi de store-uri

#### **Dezavantaje:**
- ❌ Utilizatorii trebuie să introducă cardul manual
- ❌ Nu poți publica în store-uri oficiale

---

### **2. Google Play - Google Play Billing**

#### **Cum funcționează:**
- Utilizatorul plătește prin Google Play
- Google preia 15% (prima $1M/an) sau 30% (după $1M/an)
- **Tu primești 70-85%** din venit

#### **Implementare:**
```javascript
// Expo încă nu are suport nativ pentru Google Play Billing
// Trebuie să folosești un plugin sau să faci native module

// Opțiune 1: expo-in-app-purchases (comunitate)
import * as InAppPurchases from 'expo-in-app-purchases';

// Opțiune 2: react-native-iap
import RNIap from 'react-native-iap';

// Configurare în app.json
{
  "plugins": [
    ["react-native-iap", {
      "android": {
        "billingKey": "YOUR_BILLING_KEY"
      }
    }]
  ]
}
```

#### **Pași pentru Google Play:**
1. **Creează cont Google Play Console** ($25 one-time)
2. **Configurează produsele** (subscriptions):
   - Monthly Premium: €9.99/lună
   - Yearly Premium: €99.99/an
3. **Construiește AAB** (Android App Bundle):
   ```bash
   eas build --platform android --profile production
   ```
4. **Upload în Google Play Console**
5. **Configurează Google Play Billing** în cod
6. **Submit pentru review** (1-3 zile)

---

### **3. App Store - Apple In-App Purchase**

#### **Cum funcționează:**
- Utilizatorul plătește prin App Store
- Apple preia 15% (prima $1M/an) sau 30% (după $1M/an)
- **Tu primești 70-85%** din venit

#### **Implementare:**
```javascript
// Expo încă nu are suport nativ pentru Apple IAP
// Trebuie să folosești un plugin

// Opțiune 1: expo-in-app-purchases
import * as InAppPurchases from 'expo-in-app-purchases';

// Opțiune 2: react-native-iap
import RNIap from 'react-native-iap';

// Configurare în app.json
{
  "ios": {
    "bundleIdentifier": "com.manisera.app"
  },
  "plugins": [
    ["react-native-iap", {
      "ios": {
        "appStoreSharedSecret": "YOUR_SECRET"
      }
    }]
  ]
}
```

#### **Pași pentru App Store:**
1. **Creează cont Apple Developer** ($99/an)
2. **Configurează produsele** în App Store Connect:
   - Monthly Premium: €9.99/lună
   - Yearly Premium: €99.99/an
3. **Construiește IPA**:
   ```bash
   eas build --platform ios --profile production
   ```
4. **Upload prin EAS Submit** sau Xcode
5. **Configurează Apple In-App Purchase** în cod
6. **Submit pentru review** (1-7 zile, proces strict)

---

## 🎯 Strategie Recomandată: Hybrid Approach

### **Faza 1: PWA (Acum) - MVP**
- ✅ Publică PWA cu plăți Stripe
- ✅ Testează piața și utilizatorii
- ✅ Primești feedback rapid
- ✅ Fără comisioane store-uri

### **Faza 2: Google Play (După validare)**
- ✅ Construiește APK/AAB cu EAS
- ✅ Integrează Google Play Billing
- ✅ Publică în Google Play
- ✅ Menține PWA pentru utilizatorii care preferă

### **Faza 3: App Store (Dacă e necesar)**
- ✅ Construiește IPA cu EAS
- ✅ Integrează Apple In-App Purchase
- ✅ Publică în App Store
- ✅ Menține toate opțiunile (PWA + Play + App Store)

---

## 📦 Construire Aplicații Native

### **Pentru Google Play:**

```bash
# 1. Instalează EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configurează (dacă nu e deja)
eas build:configure

# 4. Construiește AAB pentru production
eas build --platform android --profile production

# 5. După build, submit automat
eas submit --platform android
```

**Rezultat:** AAB (Android App Bundle) gata pentru Google Play

### **Pentru App Store:**

```bash
# 1. Instalează EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Construiește IPA pentru production
eas build --platform ios --profile production

# 4. După build, submit automat
eas submit --platform ios
```

**Rezultat:** IPA gata pentru App Store

---

## 💳 Integrare Plăți Native

### **Pentru Google Play Billing:**

Trebuie să adaugi `react-native-iap`:

```bash
npm install react-native-iap
npx expo install expo-build-properties
```

Apoi actualizează `app.json`:
```json
{
  "plugins": [
    "expo-router",
    [
      "expo-build-properties",
      {
        "android": {
          "googleServicesFile": "./google-services.json"
        }
      }
    ]
  ]
}
```

### **Pentru Apple In-App Purchase:**

Același `react-native-iap` funcționează și pentru iOS.

---

## 🔄 Sincronizare între Platforme

### **Problema:**
- Utilizatorul plătește pe PWA (Stripe)
- Apoi instalează aplicația din Google Play
- Cum verifici că are Premium?

### **Soluție: Backend + Account System**

1. **Creează sistem de conturi:**
   - Email/Password sau OAuth (Google, Apple)
   - Unifică toate platformele sub același cont

2. **Backend API:**
   ```javascript
   // Verifică Premium pentru orice platformă
   GET /api/user/premium-status
   {
     userId: "user_123",
     isPremium: true,
     expiresAt: "2025-01-01",
     source: "stripe" | "google_play" | "apple_store"
   }
   ```

3. **Sincronizare:**
   - PWA: Verifică cu backend după plată Stripe
   - Google Play: Verifică cu Google Play Billing + backend
   - App Store: Verifică cu Apple IAP + backend

---

## 📊 Comparație Comisioane

| Platformă | Comision | Tu primești |
|-----------|----------|-------------|
| **PWA (Stripe)** | 2.9% + €0.30 | ~97% |
| **Google Play** | 15% (prima $1M) / 30% (după) | 70-85% |
| **App Store** | 15% (prima $1M) / 30% (după) | 70-85% |

**Recomandare:** Începe cu PWA pentru a testa piața, apoi adaugă store-uri când ai validare.

---

## ✅ Checklist pentru Lansare

### **PWA (Acum):**
- [x] Service Worker configurat
- [x] Manifest.json optimizat
- [x] Buton instalare PWA
- [ ] Integrare Stripe pentru plăți
- [ ] Backend pentru verificare Premium
- [ ] Testare pe Android și iOS

### **Google Play (Viitor):**
- [ ] Cont Google Play Console ($25)
- [ ] Configurare produse (subscriptions)
- [ ] Build AAB cu EAS
- [ ] Integrare Google Play Billing
- [ ] Testare pe dispozitive reale
- [ ] Submit pentru review

### **App Store (Viitor):**
- [ ] Cont Apple Developer ($99/an)
- [ ] Configurare produse în App Store Connect
- [ ] Build IPA cu EAS
- [ ] Integrare Apple In-App Purchase
- [ ] Testare pe dispozitive reale
- [ ] Submit pentru review

---

## 🎓 Concluzie

**PWA** = Perfect pentru început, testare rapidă, fără comisioane mari
**APK/AAB** = Necesar pentru Google Play, comisioane 15-30%
**IPA** = Necesar pentru App Store, comisioane 15-30%

**Strategia optimă:** PWA acum → Google Play când ai validare → App Store dacă e necesar

