# হিফজ কম্পেনিয়ন — Fix করার নিয়ম

## ধাপ ১ — ফাইলগুলো সঠিক জায়গায় রাখো

এই ZIP এর ফাইলগুলো তোমার project folder এ এভাবে রাখো:

hifz-companion/          ← তোমার main project folder
├── package.json         ← এখান থেকে
├── metro.config.js      ← এখান থেকে
├── global.css           ← এখান থেকে
├── tailwind.config.js   ← এখান থেকে
├── nativewind-env.d.ts  ← এখান থেকে
├── tsconfig.json        ← এখান থেকে
└── lib/                 ← এই পুরো folder টা রাখো
    ├── storage-keys.ts
    ├── quran-data.ts
    ├── revision-engine.ts
    └── image-cache.ts

## ধাপ ২ — এই commands চালাও (project folder এ)

```
rd /s /q node_modules
del package-lock.json
npm install
npx expo start -c
```

## ধাপ ৩ — Expo Go তে scan করো

Terminal এ QR code দেখাবে।
Expo Go app খোলো → Scan QR code।

## ব্যস। App চলা শুরু করবে।
