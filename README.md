# Expo + TypeScript + Tailwind (NativeWind)

Quick start for the generated Expo app with TypeScript and Tailwind via NativeWind.

## Requirements
- Node.js and npm
- Expo Go app on a device, or an emulator/simulator for Android/iOS, or a browser for web

## Install
```bash
npm install
```

## Run
```bash
npm start
```
- In the Expo CLI, press `w` for web, or scan the QR code/open on Android or iOS.
or:
npx expo start

## Tailwind/NativeWind notes
- Styling uses `className` on React Native components (NativeWind).
- Content globs are configured in `tailwind.config.js`; adjust if you add new directories.
- If you change Tailwind config, restart the Expo dev server to pick up the updates.
