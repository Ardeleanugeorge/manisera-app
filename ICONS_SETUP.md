# 🎨 Ghid pentru Adăugarea Iconițelor Aplicației

## 📁 Fișiere Necesare

Trebuie să adaugi următoarele fișiere în folderul `assets/images/`:

### 1. **favicon.png** (Favicon pentru browser)
- **Dimensiune recomandată:** 32x32 px sau 64x64 px
- **Format:** PNG cu fundal transparent
- **Unde este folosit:** Tab-ul browserului, bookmarks

### 2. **icon.png** (Iconița principală PWA)
- **Dimensiuni necesare:** 
  - 192x192 px (minimum)
  - 512x512 px (recomandat)
- **Format:** PNG cu fundal transparent sau colorat
- **Unde este folosit:** 
  - PWA manifest (instalare pe telefon)
  - Apple Touch Icon (iOS)
  - Iconița aplicației în general

### 3. **adaptive-icon.png** (Android Adaptive Icon)
- **Dimensiune:** 1024x1024 px
- **Format:** PNG
- **Important:** 
  - Iconița trebuie să fie în centru
  - Zonele exterioare (25% din fiecare parte) pot fi tăiate de Android
  - Fundalul va fi folosit culoarea din `app.json` (acum: #ffffff)

### 4. **splash-icon.png** (Splash Screen)
- **Dimensiune recomandată:** 1024x1024 px sau mai mare
- **Format:** PNG
- **Unde este folosit:** Ecranul de încărcare când aplicația pornește

## 📋 Pași pentru Adăugare

### Pasul 1: Pregătește imaginile
1. Deschide imaginile trimise
2. Redimensionează-le la dimensiunile necesare (vezi mai sus)
3. Exportă-le ca PNG

### Pasul 2: Înlocuiește fișierele existente
1. Deschide folderul: `manisera-app/assets/images/`
2. Înlocuiește fișierele existente cu noile imagini:
   - `favicon.png` → imaginea ta pentru favicon
   - `icon.png` → imaginea ta principală (192x192 sau 512x512)
   - `adaptive-icon.png` → imaginea ta pentru Android
   - `splash-icon.png` → imaginea ta pentru splash screen

### Pasul 3: Verifică configurația
Fișierele sunt deja configurate în:
- ✅ `app.json` - pentru Expo/React Native
- ✅ `public/manifest.json` - pentru PWA
- ✅ `app/+html.tsx` - pentru meta tags HTML

### Pasul 4: Testează
După ce ai adăugat imaginile:
```bash
npm run build
```

Apoi verifică:
- Favicon apare în tab-ul browserului
- Iconița apare când instalezi PWA
- Splash screen apare la pornire

## 🎯 Dimensiuni Recomandate (Quick Reference)

| Fișier | Dimensiune | Format | Fundal |
|--------|------------|--------|--------|
| `favicon.png` | 32x32 sau 64x64 | PNG | Transparent |
| `icon.png` | 512x512 | PNG | Transparent sau colorat |
| `adaptive-icon.png` | 1024x1024 | PNG | Colorat (centru important) |
| `splash-icon.png` | 1024x1024+ | PNG | Colorat |

## 💡 Sfaturi

1. **Pentru icon.png (PWA):**
   - Folosește o versiune simplă, recunoscută
   - Asigură-te că este clară și la dimensiuni mici (192x192)
   - Evită text mic care nu se va vedea

2. **Pentru adaptive-icon.png (Android):**
   - Păstrează elementele importante în centrul de 512x512 px
   - Zonele exterioare pot fi tăiate de Android

3. **Pentru favicon.png:**
   - Poate fi o versiune simplificată a logo-ului
   - 32x32 px este suficient pentru majoritatea browserelor

## 🔄 După Adăugare

După ce ai înlocuit fișierele:
1. Fă commit:
   ```bash
   git add assets/images/
   git commit -m "Update app icons and favicon"
   git push
   ```

2. Vercel va face rebuild automat
3. Testează pe telefon după deploy

## ❓ Probleme Comune

**Iconița nu apare după deploy:**
- Verifică că fișierele au extensia corectă (.png)
- Verifică că dimensiunile sunt corecte
- Șterge cache-ul browserului (Ctrl+Shift+R)

**Iconița este blurată:**
- Asigură-te că folosești dimensiuni exacte (nu redimensionare în browser)
- Folosește imagini de înaltă calitate

