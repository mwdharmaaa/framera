#!/usr/bin/env bash
# ==============================================================================
# Framera - Android APK Automated Build Orchestrator
# Builds standalone native Android APK with Framera branding & assets
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
WWW_DIR="$ANDROID_DIR/app/src/main/assets/www"

echo "=============================================================================="
echo "[*] FRAMERA ANDROID APK BUILD PIPELINE"
echo "=============================================================================="

# 1. Sync Web App Assets to Android Package
echo "[*] Syncing web application bundle to Android assets..."
mkdir -p "$WWW_DIR"
cp -f "$ROOT_DIR/index.html" "$WWW_DIR/"
cp -f "$ROOT_DIR/manifest.json" "$WWW_DIR/"
cp -f "$ROOT_DIR/sw.js" "$WWW_DIR/"
cp -rf "$ROOT_DIR/css" "$WWW_DIR/"
cp -rf "$ROOT_DIR/src" "$WWW_DIR/"
cp -rf "$ROOT_DIR/assets" "$WWW_DIR/"
echo "[OK] Web application assets synchronized."

# 2. Check for local Gradle wrapper or Android SDK
cd "$ANDROID_DIR"

if command -v ./gradlew >/dev/null 2>&1; then
    echo "[*] Executing Gradle APK build..."
    ./gradlew assembleDebug
    echo "[OK] Build completed: $ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
elif command -v gradle >/dev/null 2>&1; then
    echo "[*] Building with system Gradle..."
    gradle assembleDebug
    echo "[OK] Build completed: $ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
elif command -v docker >/dev/null 2>&1; then
    echo "[*] Building via isolated Android Docker container..."
    docker run --rm -v "$ANDROID_DIR":/workspace -w /workspace mingc/android-build-box:latest ./gradlew assembleDebug
    echo "[OK] Docker container build completed."
else
    echo "[!] Local Android SDK/Gradle not found in current environment."
    echo "[*] Android project structure is ready in ./android."
    echo "[*] You can trigger automatic cloud build via GitHub Actions (.github/workflows/build-apk.yml)"
    echo "    or open ./android in Android Studio and click 'Build APK'."
fi

echo "=============================================================================="
echo "[OK] Framera Mobile Distribution Pipeline Ready."
echo "=============================================================================="
