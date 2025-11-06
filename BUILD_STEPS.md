# 🚀 Pași pentru construirea APK-ului Android

## 📋 Pași Rapizi

### 1. **Autentificare Expo** (primul pas, doar o dată)
```bash
cd manisera-app
eas login
```
- Dacă nu ai cont Expo: creează unul la https://expo.dev
- Sau folosește: `eas login --username` sau `eas login --email`

### 2. **Configurare Proiect** (doar prima dată)
```bash
eas build:configure
```
- Aceasta va crea/actualiza `eas.json` (deja există, dar va fi verificat)

### 3. **Construire APK**
```bash
eas build --platform android --profile preview
```
- Durată: 15-30 minute
- Build-ul se face în cloud (nu local)
- Vei primi un link de download când este gata

### 4. **Descărcare și Deployment**
1. Descarcă APK-ul din link-ul oferit
2. Plasează-l în `public/manisera.apk`
3. Commit și push:
```bash
git add public/manisera.apk
git commit -m "Add Android APK"
git push
```

## 🎯 Alternativă: Script Windows

Poți rula direct:
```bash
cd manisera-app
build-apk.bat
```

## ⚠️ Note Importante

- **Prima dată**: Va lua mai mult (trebuie să te autentifici)
- **Build-ul**: Se face în cloud, nu pe computerul tău
- **APK-ul**: Va avea ~30-50 MB
- **Testare**: Instalează APK-ul pe un telefon Android pentru testare

## 🔧 Probleme Comune

**"EAS CLI not found"**: 
```bash
npm install -g eas-cli
```

**"Not logged in"**:
```bash
eas login
```

**"Build failed"**: 
- Verifică că ai toate dependențele instalate: `npm install`
- Verifică că `app.json` este corect configurat


