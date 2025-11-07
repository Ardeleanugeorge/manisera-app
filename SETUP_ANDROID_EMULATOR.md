# 📱 Ghid pentru Configurarea Emulatorului Android

Acest ghid te ajută să configurezi un emulator Android pe Windows pentru a testa aplicația Manisera.

## 🚀 Opțiunea 1: Android Studio (Recomandat)

### Pași de instalare:

1. **Descarcă Android Studio:**
   - Mergi la: https://developer.android.com/studio
   - Descarcă versiunea pentru Windows
   - Fișierul va fi de ~1GB

2. **Instalează Android Studio:**
   - Rulează instalatorul
   - Alege "Standard" installation
   - Lasă toate opțiunile default
   - Va instala automat:
     - Android SDK
     - Android SDK Platform-Tools
     - Android Emulator

3. **Configurează variabilele de mediu:**
   
   După instalare, adaugă în PATH:
   ```
   C:\Users\George\AppData\Local\Android\Sdk\platform-tools
   C:\Users\George\AppData\Local\Android\Sdk\emulator
   ```
   
   **Cum să adaugi în PATH:**
   - Apasă `Win + R`, scrie `sysdm.cpl`, apasă Enter
   - Tab "Advanced" → "Environment Variables"
   - În "System variables", găsește "Path" → "Edit"
   - "New" → adaugă cele două path-uri de mai sus
   - OK, OK, OK

4. **Creează un emulator:**
   - Deschide Android Studio
   - "More Actions" → "Virtual Device Manager"
   - "Create Device"
   - Alege un telefon (ex: Pixel 5)
   - Alege o versiune de Android (ex: API 33 sau 34)
   - "Finish"

5. **Pornește emulatorul:**
   - În Virtual Device Manager, apasă pe "Play" (▶️) lângă emulator
   - Sau din terminal: `emulator -avd <nume_emulator>`

## 🎯 Opțiunea 2: Expo Go (Mai simplu, dar necesită telefon fizic)

Dacă ai un telefon Android fizic:

1. **Instalează Expo Go** pe telefon din Google Play Store

2. **Pornește aplicația:**
   ```bash
   cd manisera-app
   npm start
   ```

3. **Scanează QR code-ul** cu Expo Go app

## 🔧 Opțiunea 3: Testare rapidă cu Expo Development Build

După ce ai Android Studio instalat:

```bash
cd manisera-app

# Pornește emulatorul din Android Studio mai întâi

# Apoi rulează:
npm run android
```

Sau:

```bash
npx expo start --android
```

## ✅ Verificare instalare

După instalarea Android Studio, verifică:

```bash
# Verifică ADB
adb version

# Verifică emulatori disponibili
emulator -list-avds

# Verifică Android SDK
echo $env:ANDROID_HOME
```

## 🐛 Rezolvare probleme

**"adb not found":**
- Verifică că ai adăugat platform-tools în PATH
- Repornește terminalul după modificarea PATH

**"Android SDK not found":**
- Setează variabila ANDROID_HOME:
  ```powershell
  [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\George\AppData\Local\Android\Sdk', 'User')
  ```

**Emulatorul nu pornește:**
- Verifică că ai activat Virtualization în BIOS
- Verifică că Hyper-V este dezactivat (dacă folosești Windows Home)

## 📝 Note importante

- Android Studio ocupă ~3-5 GB spațiu
- Primul build poate dura 10-15 minute
- Emulatorul necesită cel puțin 4GB RAM alocați

## 🚀 După configurare

Odată ce emulatorul rulează:

```bash
cd manisera-app
npm start
# Apoi apasă 'a' pentru Android
```

Sau:

```bash
npm run android
```


