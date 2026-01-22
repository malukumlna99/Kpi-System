# Mobile App Deployment Guide

## Overview
Panduan deploy React Native mobile app ke Google Play Store dan Apple App Store.

---

## Prerequisites

### Android:
- Android Studio
- JDK 11+
- Android SDK

### iOS:
- macOS
- Xcode
- Apple Developer Account ($99/year)

---

## Build Android APK/AAB

### Step 1: Generate Keystore
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Configure Gradle

**android/gradle.properties:**
