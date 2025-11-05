# 🌟 Manisera - Aplicația de Afirmații Personalizate

Manisera este o aplicație web modernă pentru practicarea afirmațiilor personalizate, dezvoltată cu React Native și Expo.

## ✨ Caracteristici

- **6 categorii de focus**: Bani, Sănătate, Iubire, Încredere, Calm, Focus
- **3 sesiuni pe zi**: Dimineața, După-amiaza, Seara
- **Recunoaștere vocală**: Verifică rostitul afirmațiilor
- **Personalizare avansată**: 600 de afirmații per categorie
- **Sistem Premium**: Freemium model cu upgrade
- **Progres secvențial**: Zilele se deblochează pas cu pas

## 🚀 Deployment pe Vercel

Aplicația este configurată pentru deployment automat pe Vercel:

1. **Build automat** la fiecare push pe GitHub
2. **HTTPS gratuit** pentru speech recognition
3. **CDN global** pentru performanță optimă

## 🛠️ Tehnologii

- React Native + Expo
- TypeScript
- Expo Router
- Speech Recognition API
- LocalStorage pentru persistență

## 📱 Demo

Aplicația este disponibilă online la: [manisera.vercel.app](https://manisera.vercel.app)

## 🔧 Dezvoltare locală

```bash
# Instalare dependențe
npm install

# Pornire development server
npm run web

# Build pentru producție
npm run build
```

## 📱 Construire Aplicație Android

Pentru a construi APK-ul Android, vezi:
- **[QUICK_BUILD.txt](QUICK_BUILD.txt)** - Instrucțiuni rapide
- **[BUILD_STEPS.md](BUILD_STEPS.md)** - Ghid detaliat pas cu pas
- **[BUILD_ANDROID.md](BUILD_ANDROID.md)** - Documentație completă

### Pași rapizi:
```bash
cd manisera-app
eas login                    # Autentificare Expo (doar prima dată)
eas build --platform android --profile preview
```

## 📄 Licență

© 2024 Manisera. Toate drepturile rezervate.

