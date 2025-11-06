# 📱 Ghid pentru construirea aplicației Android

Acest ghid te ajută să construiești aplicația Android (APK) pentru Manisera.

## 🚀 Opțiuni de Build

### Opțiunea 1: Expo Application Services (EAS) - Recomandat

EAS Build este serviciul oficial Expo pentru construirea aplicațiilor native.

#### Pași:

1. **Instalează EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Autentifică-te:**
```bash
eas login
```

3. **Configurează proiectul:**
```bash
eas build:configure
```

4. **Construiește APK-ul pentru Android:**
```bash
eas build --platform android --profile preview
```

Sau pentru AAB (Android App Bundle) pentru Google Play:
```bash
eas build --platform android --profile production
```

5. **Descarcă APK-ul:**
   - După ce build-ul este gata, vei primi un link de download
   - Descarcă APK-ul și plasează-l în folderul `public/` pentru a fi servit de Vercel

### Opțiunea 2: Build Local (avansat)

Dacă ai Android Studio instalat:

```bash
# Generează proiectul Android
npx expo prebuild --platform android

# Construiește APK
cd android
./gradlew assembleRelease
```

APK-ul va fi în `android/app/build/outputs/apk/release/`

## 📤 Hosting APK-ul

### Pe Vercel:

1. Plasează APK-ul în folderul `public/`:
```
public/manisera.apk
```

2. Vercel va servi automat fișierul la:
```
https://manisera-app.vercel.app/manisera.apk
```

### Alternativ - CDN:

Poți folosi servicii precum:
- Firebase Hosting
- AWS S3
- Cloudflare R2

## 🔧 Configurare app.json

Aplicația este deja configurată pentru Android în `app.json`:

```json
{
  "android": {
    "package": "com.manisera.app",
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    }
  }
}
```

## 📝 Note importante:

1. **Permisiuni**: Aplicația necesită permisiune pentru microfon (pentru speech recognition)
2. **Signing**: Pentru release, vei avea nevoie de un keystore pentru semnarea APK-ului
3. **Version**: Actualizează versiunea în `app.json` la fiecare build nou

## 🎯 Următorii pași:

1. Construiește APK-ul folosind EAS Build
2. Plasează APK-ul în `public/manisera.apk`
3. Actualizează URL-ul în `app/download.tsx` dacă este necesar
4. Testează download-ul pe un dispozitiv Android

## ❓ Probleme comune:

**"Build failed"**: Verifică că ai toate dependențele instalate (`npm install`)

**"APK not found"**: Asigură-te că APK-ul este în folderul `public/` și este numit `manisera.apk`

**"Installation blocked"**: Utilizatorii trebuie să permită instalarea din "sursa necunoscută" în setările Android


