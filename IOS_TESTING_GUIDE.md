# iOS Testing Guide

## Option 1: Expo Go App (Easiest - Instant Testing)

**Best for:** Quick testing, sharing with friends/colleagues

### For Testers:
1. Download **Expo Go** from the App Store (free)
2. Open the app
3. Scan the QR code you provide OR open the link you share
4. The app loads instantly on their iPhone!

### For You (to share):

**Method A: Local Network (Same WiFi)**
```bash
npm start
```
- Show the QR code to testers on the same WiFi
- Or share the `exp://` URL displayed in terminal

**Method B: Tunnel (Works Anywhere)**
```bash
npx expo start --tunnel
```
- This creates a public URL that works from anywhere
- Share the QR code or link with anyone
- They can test from anywhere in the world!

### Limitations:
- Testers must have Expo Go app installed
- Some advanced native features may not work exactly like a standalone app
- Your dev server must be running

---

## Option 2: TestFlight (Apple's Official Beta Testing)

**Best for:** Professional testing, feels like a real app

### Prerequisites:
- Apple Developer Account ($99/year - required)
- Mac computer (for building)

### Steps:

1. **Create an Expo account** (free):
   ```bash
   npx expo login
   ```

2. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

3. **Configure EAS**:
   ```bash
   eas build:configure
   ```

4. **Build for iOS**:
   ```bash
   eas build --platform ios --profile preview
   ```
   This will:
   - Build your app in the cloud (no Mac needed for this step!)
   - Take 10-20 minutes
   - Give you an IPA file or TestFlight link

5. **Submit to TestFlight** (if you have Apple Developer account):
   ```bash
   eas submit --platform ios
   ```

6. **Share with testers**:
   - Add testers in App Store Connect
   - They get an email invitation
   - They download TestFlight app
   - They install your app from TestFlight

### Benefits:
- Feels like a real app store app
- No Expo Go needed
- Push notifications work
- All native features work
- Up to 10,000 testers

---

## Option 3: Ad Hoc Build (No TestFlight)

**Best for:** Testing on specific devices without App Store

Using EAS Build:
```bash
eas build --platform ios --profile development
```

Then share the IPA file directly with testers (they'll need to install via Xcode or a provisioning profile).

---

## Recommended Approach for You:

### For Quick Testing (Free, Instant):
**Use Expo Go + Tunnel**

```bash
# Start with tunnel
npx expo start --tunnel

# You'll see:
# - QR code
# - URL like: exp://u.expo.dev/abc123
```

Share the QR code or URL with testers. They:
1. Install Expo Go from App Store
2. Open the link or scan QR code
3. App runs instantly!

### For Professional/Production Testing:
**Use TestFlight** (requires $99 Apple Developer account)

---

## Quick Start: Expo Go Testing

Run this command right now:
```bash
npx expo start --tunnel
```

Then:
1. You'll see a QR code in the terminal
2. Share a screenshot of the QR code with your testers
3. They open Expo Go app and scan it
4. Your app loads on their iPhone!

**The tunnel stays active as long as your terminal is running.**

---

## Comparison Table

| Method | Cost | Setup Time | Feels Like Real App | Requires Dev Server | Max Testers |
|--------|------|------------|---------------------|---------------------|-------------|
| Expo Go (tunnel) | Free | 30 seconds | No | Yes | Unlimited |
| TestFlight | $99/year | 1-2 hours | Yes | No | 10,000 |
| Ad Hoc | $99/year | 2-3 hours | Yes | No | 100 devices |

---

## Start Right Now:

```bash
# Option 1: Local network only
npm start

# Option 2: Works from anywhere (recommended)
npx expo start --tunnel
```

Then just share the QR code or link that appears!
