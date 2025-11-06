# 💳 Comportament Premium - Online vs Offline

Acest document explică cum funcționează Premium în diferite scenarii de conectivitate.

## 📱 Scenarii de Utilizare

### 1️⃣ **Upgrade la Premium** 🆙

#### **Când utilizatorul este CONECTAT la internet:**
✅ **Funcționează:**
- Utilizatorul poate face upgrade la Premium
- Plata este procesată (Stripe, Google Play, etc.)
- Premium este activat IMEDIAT
- Statusul este salvat local (offline)
- Statusul este sincronizat cu backend (dacă există)

#### **Când utilizatorul NU este conectat la internet:**
❌ **NU funcționează:**
- Upgrade la Premium **NU este posibil fără internet**
- Este necesară conexiune pentru:
  - Procesare plată
  - Verificare card
  - Sincronizare cu backend
- Mesaj: "Conexiune la internet necesară pentru upgrade"

**Soluție în cod:**
```javascript
const handleUpgrade = async () => {
  // Check if online
  if (!navigator.onLine) {
    alert('Conexiune la internet necesară pentru upgrade la Premium');
    return;
  }
  
  // Process payment...
};
```

---

### 2️⃣ **Utilizare Premium (după upgrade)** ✨

#### **Când utilizatorul este CONECTAT:**
✅ **Funcționează complet:**
- Toate funcțiile Premium active
- Sincronizare cu backend (dacă există)
- Backup progres automat
- Notificări push (dacă implementate)

#### **Când utilizatorul NU este conectat:**
✅ **Funcționează complet:**
- Toate funcțiile Premium active
- Datele sunt salvate local
- Verificare expirare funcționează (folosind data locală)
- Sync când se reconectează

**Important:** Premium funcționează OFFLINE după ce a fost activat!

---

### 3️⃣ **Expirare Premium** ⏰

#### **Când Premium expiră (după 1 lună/an):**

##### **Scenariul A: Utilizatorul este CONECTAT la internet**

**Comportament:**
1. La deschiderea aplicației → verifică data expirării
2. Dacă `expiresAt < Date.now()` → Premium expirat
3. Verifică cu backend (dacă există) dacă utilizatorul a reînnoit
4. Dacă nu a reînnoit → **downgrade automat la Free**
5. Toate funcțiile Premium devin inactive
6. Utilizatorul vede mesaj: "Premium expirat. Upgrade pentru a continua."

##### **Scenariul B: Utilizatorul NU este conectat la internet**

**Comportament:**
1. La deschiderea aplicației → verifică data expirării (folosind data locală)
2. Dacă `expiresAt < Date.now()` → Premium expirat
3. **Downgrade automat la Free** (chiar fără internet)
4. Toate funcțiile Premium devin inactive
5. Când se reconectează → verifică cu backend dacă a reînnoit

**Important:** Expirarea funcționează OFFLINE folosind data locală a dispozitivului!

---

### 4️⃣ **Verificare Expirare în Timp Real** 🔄

#### **Cum funcționează:**

```javascript
// La fiecare oră, verifică dacă Premium a expirat
useEffect(() => {
  const checkPremiumStatus = () => {
    const premiumStatus = getPremiumStatus();
    
    // Check if expired (works offline)
    if (premiumStatus.isPremium && premiumStatus.expiresAt) {
      if (premiumStatus.expiresAt < Date.now()) {
        // Downgrade to free
        setIsPremium(false);
      }
    }
  };
  
  // Check immediately
  checkPremiumStatus();
  
  // Check every hour
  const interval = setInterval(checkPremiumStatus, 60 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

#### **Ce se întâmplă:**
- ✅ Verificare la deschiderea aplicației
- ✅ Verificare la fiecare oră (cât timp aplicația rulează)
- ✅ Funcționează offline (folosește `Date.now()` local)
- ✅ Downgrade automat când expiră

---

## 📊 Flux Complet

### **Upgrade Flow:**
```
Utilizator vrea Premium
    ↓
Verifică conexiune internet
    ↓
DA → Procesează plată → Activează Premium → Salvează local + Sync backend
NU → Mesaj: "Internet necesar"
```

### **Expirare Flow:**
```
Utilizator deschide aplicația
    ↓
Verifică data expirării (local)
    ↓
Expirat? → DA → Downgrade la Free
         → NU → Păstrează Premium
    ↓
Dacă online → Verifică cu backend (reînnoire?)
```

---

## 🔒 Securitate și Limitări

### **Probleme Potențiale:**

1. **Manipulare Data Sistem:**
   - Utilizatorul poate schimba data telefonului pentru a prelungi Premium
   - **Soluție:** Verificare cu backend când este online

2. **Premium Permanent Offline:**
   - Dacă utilizatorul nu se conectează niciodată, Premium rămâne activ
   - **Soluție:** Verificare periodică cu backend (când online)

3. **Multe Dispozitive:**
   - Premium pe un dispozitiv nu înseamnă Premium pe altul
   - **Soluție:** Sincronizare cu backend (Firebase, etc.)

### **Recomandări:**

1. ✅ Verificare offline cu data locală (funcționează)
2. ✅ Verificare cu backend când este online (pentru securitate)
3. ✅ Sync periodic (o dată pe zi când este online)
4. ✅ Alertă când Premium expiră

---

## 🎯 Concluzie

### **Upgrade:**
- ❌ **NU funcționează offline** - necesită internet pentru plată

### **Utilizare Premium:**
- ✅ **Funcționează offline** - după activare

### **Expirare:**
- ✅ **Funcționează offline** - verifică data locală
- ✅ **Downgrade automat** - când expiră, chiar fără internet

### **Reînnoire:**
- ❌ **NU funcționează offline** - necesită internet pentru plată


