# KPI Management System - Mobile App

React Native mobile application untuk sistem penilaian KPI karyawan Soerbaja 45 Printing.

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- React Native CLI
- Android Studio (untuk Android)
- Xcode (untuk iOS, macOS only)

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Install iOS Pods (macOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Configure API Endpoint

Edit `src/services/api.js` dan set `API_BASE_URL`:

```javascript
const API_BASE_URL = 'http://YOUR_BACKEND_IP:3000/api/v1';
```

**Note untuk Android Emulator:**
- Gunakan `10.0.2.2` untuk localhost
- Contoh: `http://10.0.2.2:3000/api/v1`

**Note untuk iOS Simulator:**
- Gunakan `localhost` atau IP komputer
- Contoh: `http://localhost:3000/api/v1`

## 🏃 Running the App

### Android

```bash
npm run android
```

### iOS (macOS only)

```bash
npm run ios
```

### Start Metro Bundler

```bash
npm start
```

## 📱 Features

### For Karyawan:
- ✅ Login dengan email & password
- ✅ Lihat daftar KPI
- ✅ Isi assessment KPI
- ✅ Lihat riwayat penilaian
- ✅ Lihat detail score dan grade
- ✅ Profile management

### For Manager:
- ✅ All karyawan features
- ✅ Review assessment karyawan
- ✅ Lihat dashboard performa
- ✅ Berikan feedback

## 📂 Project Structure

```
mobile/
├── src/
│   ├── components/       # Reusable components
│   │   ├── common/       # Button, Card, Input, etc
│   │   └── custom/       # KPICard, AssessmentCard, etc
│   ├── screens/          # App screens
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── KPIScreen.js
│   │   ├── KPIDetailScreen.js
│   │   ├── HistoryScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/       # Navigation setup
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── context/          # Context API
│   │   └── AuthContext.js
│   └── services/         # API services
│       └── api.js
├── android/              # Android native files
├── ios/                  # iOS native files
├── App.js               # Entry point
└── package.json
```

## 🧪 Testing

```bash
npm test
```

## 📦 Build for Production

### Android APK

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Android AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS (macOS only)

1. Open `ios/KPISystem.xcworkspace` in Xcode
2. Select Product → Archive
3. Follow distribution wizard

## 🔧 Troubleshooting

### Metro bundler won't start

```bash
npm start -- --reset-cache
```

### Android build failed

```bash
cd android
./gradlew clean
cd ..
```

### iOS build failed

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Cannot connect to backend

1. Pastikan backend sudah running
2. Cek API_BASE_URL di `src/services/api.js`
3. Untuk Android emulator gunakan `10.0.2.2`
4. Untuk physical device gunakan IP komputer

## 📝 Default Credentials

```
Manager:
Email: manager@soerbaja45.com
Password: Manager123

Karyawan:
Email: budi@soerbaja45.com
Password: Karyawan123
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - Soerbaja 45 Printing © 2024
