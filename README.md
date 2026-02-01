# Codex App

A small Expo app that hosts a few mini apps:
- Wake-up tracker (log wake times and view a simple graph)
- Reps tracker (track exercise reps with quick adjustments)
- Design lab (UI component showcase)

## Run locally
```bash
cd expo-app
npx expo start
```

## Deploy to your phone (Expo build)
1) Create/sign in to an Expo account.
2) From the project root, go into the app folder:
```bash
cd expo-app
```
3) Build with Expo (EAS) and upload to Expo’s servers:
```bash
eas build -p android
```
(or `-p ios` for iOS)
4) When the build finishes, open the build page on expo.dev and install it on your phone.
