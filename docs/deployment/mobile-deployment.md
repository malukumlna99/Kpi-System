# Mobile App Deployment Guide

## Overview
Panduan lengkap deploy React Native mobile app ke Google Play Store dan Apple App Store.

---

## Prerequisites

### Android:
- Android Studio
- JDK 11+
- Android SDK
- Gradle
- Google Play Developer Account ($25 one-time)

### iOS:
- macOS
- Xcode 14+
- CocoaPods
- Apple Developer Account ($99/year)

### General:
- React Native CLI
- Node.js >= 18.0.0

---

## Configure API Endpoint

### Android: `android/app/src/main/res/values/strings.xml`
```xml
<resources>
    <string name="app_name">KPI System</string>
    <string name="api_base_url">https://api.yourdomain.com/v1</string>
</resources>
```

### iOS: `ios/KPISystem/Info.plist`
```xml
<key>API_BASE_URL</key>
<string>https://api.yourdomain.com/v1</string>
```

### Environment Config: `src/config/api.js`
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'
  : 'https://api.yourdomain.com/v1';

export default API_BASE_URL;
```

---

## Build Android APK/AAB

### Step 1: Generate Keystore

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore kpi-release-key.keystore \
  -alias kpi-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Remember:**
- Store password securely
- Backup keystore file
- Never commit keystore to git

### Step 2: Configure Gradle

**Create `android/gradle.properties`:**
```properties
MYAPP_RELEASE_STORE_FILE=kpi-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=kpi-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password

# Android Build
android.useAndroidX=true
android.enableJetifier=true

# Performance
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.daemon=true
```

**Update `android/app/build.gradle`:**
```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.soerbaja45.kpi"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }
}
```

### Step 3: Build APK (for testing)

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Step 4: Build AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 5: Test APK

```bash
# Install on connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# Or drag & drop to emulator
```

---

## Build iOS

### Step 1: Install Dependencies

```bash
cd ios
pod install
cd ..
```

### Step 2: Open Xcode

```bash
open ios/KPISystem.xcworkspace
```

**Note:** Always open `.xcworkspace`, not `.xcodeproj`

### Step 3: Configure Project

1. Select project in Xcode
2. Select KPISystem target
3. General tab:
   - Display Name: `KPI System`
   - Bundle Identifier: `com.soerbaja45.kpi`
   - Version: `1.0.0`
   - Build: `1`

### Step 4: Configure Signing & Capabilities

1. Go to Signing & Capabilities tab
2. Automatically manage signing: ✓
3. Team: Select your Apple Developer team
4. Signing Certificate: Apple Development/Distribution

### Step 5: Configure Build Settings

1. Select Build Settings tab
2. Search "bitcode"
3. Enable Bitcode: `No` (for React Native)

### Step 6: Build for Testing (Simulator)

```bash
npx react-native run-ios --configuration Release
```

### Step 7: Archive for App Store

1. In Xcode, select menu: Product → Scheme → Edit Scheme
2. Set Build Configuration to `Release`
3. Select menu: Product → Archive
4. Wait for build to complete
5. Organizer window will open

### Step 8: Validate Archive

1. In Organizer, select your archive
2. Click "Validate App"
3. Follow wizard
4. Fix any issues

### Step 9: Distribute to App Store

1. Click "Distribute App"
2. Select "App Store Connect"
3. Select "Upload"
4. Follow wizard
5. Submit

---

## Publish to Google Play Store

### Step 1: Create App in Play Console

1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill details:
   - App name: `KPI Management System - Soerbaja 45`
   - Default language: Indonesian
   - App/Game: App
   - Free/Paid: Free

### Step 2: Setup Store Listing

**Required Information:**
- App name: `KPI Management System`
- Short description (80 chars):
  ```
  Sistem penilaian kinerja karyawan untuk Soerbaja 45 Printing
  ```
- Full description (4000 chars):
  ```
  KPI Management System adalah aplikasi penilaian kinerja karyawan yang dirancang khusus untuk Soerbaja 45 Printing.

  Fitur Utama:
  • Login aman dengan autentikasi JWT
  • Pengisian penilaian KPI bulanan
  • Riwayat penilaian lengkap
  • Notifikasi reminder penilaian
  • Dashboard performa karyawan
  • Feedback dari manager

  Untuk Karyawan:
  • Isi penilaian KPI sesuai periode
  • Lihat riwayat penilaian
  • Lihat skor dan grade
  • Terima feedback dari manager

  Untuk Manager:
  • Review penilaian karyawan
  • Berikan feedback
  • Lihat laporan performa tim
  • Analisis tren performa

  Hubungi kami: support@soerbaja45.com
  ```

**Required Assets:**
- App icon: 512x512 PNG
- Feature graphic: 1024x500 PNG
- Screenshots:
  - Phone: Minimum 2 (1080x1920 or 1920x1080)
  - 7-inch tablet: Minimum 2
  - 10-inch tablet: Minimum 2

**App categorization:**
- App category: Business
- Content rating: Everyone

**Contact details:**
- Email: support@soerbaja45.com
- Phone: +62 xxx xxx xxxx (optional)
- Website: https://www.soerbaja45.com

**Privacy policy URL:**
- https://www.soerbaja45.com/privacy-policy

### Step 3: Content Rating

1. Go to Content rating
2. Fill questionnaire
3. Submit for rating

### Step 4: Select Countries

1. Go to Countries/regions
2. Select available countries
3. Recommended: Indonesia, or worldwide

### Step 5: Pricing & Distribution

1. Set app as Free
2. Accept terms
3. Select distribution channels

### Step 6: Upload AAB

1. Go to Production → Releases
2. Click "Create new release"
3. Upload AAB file
4. Release name: `1.0.0`
5. Release notes:
   ```
   Initial release
   - Login karyawan & manager
   - Pengisian KPI assessment
   - Riwayat penilaian
   - Dashboard performa
   ```
6. Save and review
7. Start rollout to production

### Step 7: Review & Publish

1. Review all sections (must all be green ✓)
2. Click "Send for review"
3. Wait for Google approval (usually 1-3 days)

---

## Publish to Apple App Store

### Step 1: Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill details:
   - Platform: iOS
   - Name: `KPI Management System`
   - Primary Language: Indonesian
   - Bundle ID: `com.soerbaja45.kpi`
   - SKU: `kpi-system-001`
   - User Access: Full Access

### Step 2: Fill App Information

**General Information:**
- Subtitle: `Penilaian Kinerja Karyawan`
- Categories:
  - Primary: Business
  - Secondary: Productivity

**Privacy:**
- Privacy Policy URL: `https://www.soerbaja45.com/privacy`
- Does app use IDFA? No

**Pricing:**
- Price: Free

**App Privacy:**
Fill out required privacy practices

### Step 3: Prepare Metadata

**Description (4000 chars max):**
```
KPI Management System adalah aplikasi penilaian kinerja karyawan yang dirancang khusus untuk Soerbaja 45 Printing.

FITUR UTAMA
• Login aman dengan autentikasi JWT
• Pengisian penilaian KPI bulanan
• Riwayat penilaian lengkap
• Notifikasi reminder penilaian
• Dashboard performa karyawan
• Feedback dari manager

UNTUK KARYAWAN
• Isi penilaian KPI sesuai periode
• Lihat riwayat penilaian
• Lihat skor dan grade
• Terima feedback dari manager

UNTUK MANAGER
• Review penilaian karyawan
• Berikan feedback
• Lihat laporan performa tim
• Analisis tren performa

Hubungi kami di support@soerbaja45.com untuk bantuan.
```

**Keywords:**
```
kpi,performance,kinerja,penilaian,karyawan,soerbaja45,printing
```

**Support URL:**
```
https://www.soerbaja45.com/support
```

**Marketing URL (optional):**
```
https://www.soerbaja45.com
```

### Step 4: Prepare Screenshots

**Required sizes:**
- 6.5" Display (iPhone 14 Pro Max): 1290x2796
- 5.5" Display (iPhone 8 Plus): 1242x2208

**Recommended: 3-5 screenshots showing:**
1. Login screen
2. KPI list/home screen
3. Assessment form
4. History screen
5. Profile/Dashboard

Use tools like:
- Figma with device frames
- Screenshot.rocks
- AppMockUp

### Step 5: App Icon

- Size: 1024x1024 PNG
- No alpha channel
- No rounded corners (Apple adds them)

### Step 6: App Review Information

**Contact Information:**
- First Name: Your Name
- Last Name: Your Name
- Phone: +62 xxx xxx xxxx
- Email: support@soerbaja45.com

**Demo Account (for review):**
```
Username: reviewer@soerbaja45.com
Password: Reviewer123
Role: karyawan

Manager Account:
Username: manager.review@soerbaja45.com
Password: Manager123
```

**Notes:**
```
This app is for Soerbaja 45 Printing employees to fill their monthly KPI assessments.

Test account provided:
- Employee account for basic features
- Manager account for review features

Please test the assessment flow and review process.
```

### Step 7: Upload Build

Build already uploaded via Xcode Archive → Distribute.

1. Go to Build section
2. Click "+" next to Build
3. Select uploaded build
4. Save

### Step 8: Submit for Review

1. Click "Add for Review"
2. Complete all sections
3. Click "Submit to App Review"
4. Wait for review (usually 24-48 hours)

---

## Fastlane Setup (CI/CD)

### Install Fastlane

```bash
sudo gem install fastlane -NV
```

### Initialize Fastlane

```bash
cd android
fastlane init

cd ../ios
fastlane init
```

### Configure Fastlane

**`android/fastlane/Fastfile`:**
```ruby
default_platform(:android)

platform :android do
  desc "Build and upload to Google Play Internal Testing"
  lane :internal do
    gradle(
      task: "clean bundleRelease",
      project_dir: "android/"
    )
    upload_to_play_store(
      track: 'internal',
      aab: 'android/app/build/outputs/bundle/release/app-release.aab',
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end

  desc "Deploy to Google Play Production"
  lane :production do
    gradle(
      task: "clean bundleRelease",
      project_dir: "android/"
    )
    upload_to_play_store(
      track: 'production',
      aab: 'android/app/build/outputs/bundle/release/app-release.aab'
    )
  end
end
```

**`ios/fastlane/Fastfile`:**
```ruby
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    increment_build_number(xcodeproj: "KPISystem.xcodeproj")
    build_app(
      scheme: "KPISystem",
      workspace: "KPISystem.xcworkspace",
      export_method: "app-store"
    )
    upload_to_testflight
  end

  desc "Deploy to App Store"
  lane :release do
    build_app(
      scheme: "KPISystem",
      workspace: "KPISystem.xcworkspace",
      export_method: "app-store"
    )
    upload_to_app_store
  end
end
```

### Run Fastlane

```bash
# Android Internal Testing
cd android
fastlane internal

# Android Production
fastlane production

# iOS TestFlight
cd ios
fastlane beta

# iOS App Store
fastlane release
```

---

## GitHub Actions CI/CD

**`.github/workflows/deploy-mobile.yml`:**
```yaml
name: Deploy Mobile Apps

on:
  push:
    branches: [ main ]
    paths:
      - 'mobile/**'

jobs:
  deploy-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'
      
      - name: Install dependencies
        working-directory: ./mobile
        run: npm ci
      
      - name: Build Android AAB
        working-directory: ./mobile/android
        run: ./gradlew bundleRelease
        env:
          MYAPP_RELEASE_STORE_FILE: ${{ secrets.KEYSTORE_FILE }}
          MYAPP_RELEASE_KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          MYAPP_RELEASE_STORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          MYAPP_RELEASE_KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
      
      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.PLAY_STORE_JSON }}
          packageName: com.soerbaja45.kpi
          releaseFiles: mobile/android/app/build/outputs/bundle/release/app-release.aab
          track: internal

  deploy-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./mobile
        run: npm ci
      
      - name: Install CocoaPods
        working-directory: ./mobile/ios
        run: pod install
      
      - name: Build iOS
        run: |
          cd mobile/ios
          fastlane beta
        env:
          FASTLANE_USER: ${{ secrets.APPLE_ID }}
          FASTLANE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
```

---

## Version Management

### Increment Version (Android)

**`android/app/build.gradle`:**
```gradle
android {
    defaultConfig {
        versionCode 2  // Increment for each release
        versionName "1.0.1"
    }
}
```

### Increment Version (iOS)

```bash
# Using Xcode: Select target → General → Version
# Or use Fastlane:
cd ios
fastlane run increment_version_number version_number:1.0.1
fastlane run increment_build_number
```

---

## Troubleshooting

### Android Build Errors

**"Execution failed for task ':app:processReleaseResources'"**
```bash
cd android
./gradlew clean
cd ..
npx react-native start --reset-cache
```

**"Could not resolve all files for configuration"**
```bash
cd android
./gradlew --refresh-dependencies
```

### iOS Build Errors

**"No profiles for 'com.soerbaja45.kpi' were found"**
1. Open Xcode
2. Preferences → Accounts → Download Manual Profiles
3. Or use automatic signing

**"Command PhaseScriptExecution failed"**
```bash
cd ios
pod deintegrate
pod install
```

### Common Issues

**Metro bundler won't start:**
```bash
npx react-native start --reset-cache
```

**Build succeeds but app crashes:**
- Check API endpoint configuration
- Check for missing native dependencies
- Review crash logs

---

## Testing Before Release

### Android Testing Checklist
- [ ] Install APK on real device
- [ ] Test all features
- [ ] Test on different screen sizes
- [ ] Test on Android 8, 10, 12, 13
- [ ] Check permissions
- [ ] Test offline behavior
- [ ] Check performance

### iOS Testing Checklist
- [ ] Test on real iPhone
- [ ] Test on different iOS versions (14, 15, 16)
- [ ] Test on different screen sizes
- [ ] Check permissions
- [ ] Test offline behavior
- [ ] Check performance
- [ ] Submit to TestFlight for beta testing

---

## Post-Release

### Monitor

**Android:**
- Google Play Console → Statistics
- Check crash reports
- Monitor reviews

**iOS:**
- App Store Connect → Analytics
- Check TestFlight feedback
- Monitor reviews

### Update Strategy

1. Fix critical bugs immediately
2. Bundle minor fixes for weekly releases
3. Major features in monthly releases
4. Always test on TestFlight/Internal Testing first

---

## Useful Commands

```bash
# Check React Native version
npx react-native --version

# Clean build
cd android && ./gradlew clean
cd ios && xcodebuild clean

# Reset cache
npx react-native start --reset-cache

# Debug APK
cd android && ./gradlew assembleDebug

# Release APK
cd android && ./gradlew assembleRelease

# Bundle (AAB)
cd android && ./gradlew bundleRelease

# iOS Debug
npx react-native run-ios

# iOS Release
npx react-native run-ios --configuration Release
```
