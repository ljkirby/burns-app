# Burns App - Testing Instructions

## 🌐 Web Testing (Anyone with a browser)

**Option 1: Deploy to Netlify (Recommended)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `dist` folder onto the page
3. Share the URL you get (e.g., `https://burns-app-abc123.netlify.app`)

Your `dist` folder is ready at: `/Users/ljkirby/repos/burns-app/dist`

**Option 2: Local testing**
```bash
npx serve dist
```

---

## 📱 iOS Testing (Native iPhone App)

### Method 1: Expo Go (Easiest - Free, Instant)

**For testers:**
1. Download **Expo Go** app from App Store (free)
2. Open Expo Go
3. Scan the QR code or open the link you share

**For you to start:**
```bash
# Option A: Same WiFi network only
npm start

# Option B: Works from anywhere (with tunnel)
npx expo start --tunnel
```

When the server starts, you'll see a QR code. Share a screenshot of that QR code or the `exp://` URL with your testers!

**Benefits:**
- ✅ Free
- ✅ Instant - no build process
- ✅ Works on real iPhones
- ✅ Full camera functionality
- ✅ All features work
- ✅ Unlimited testers

**Limitations:**
- Requires Expo Go app
- Your dev server must stay running
- Shows "Expo Go" branding

---

### Method 2: TestFlight (Professional - Requires Apple Developer Account)

**Requirements:**
- Apple Developer account ($99/year)

**Steps:**
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
npx expo login

# 3. Configure
eas build:configure

# 4. Build for iOS
eas build --platform ios

# 5. Submit to TestFlight
eas submit --platform ios
```

Then invite testers in App Store Connect.

**Benefits:**
- ✅ Feels like a real App Store app
- ✅ No Expo Go needed
- ✅ Works offline
- ✅ Up to 10,000 testers
- ✅ Professional presentation

---

## 🚀 Quick Start

### For Web (30 seconds):
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag `dist` folder
3. Share the URL!

### For iOS (2 minutes):
```bash
npm start
```
Then share the QR code that appears with your testers!

---

## Current Status

✅ Web build ready: `dist/` folder contains your deployable web app
✅ All features implemented:
  - AI Analysis screen with camera/photo upload
  - Parkland formula calculator
  - Protocol viewer (Burns & Hypothermia)
  - PDF generation and sharing

📱 Ready for iOS testing via Expo Go
🍎 Ready for TestFlight build (requires Apple Developer account)

---

## File Locations

- **Web build**: `/Users/ljkirby/repos/burns-app/dist/`
- **Source code**: `/Users/ljkirby/repos/burns-app/`
- **Assets**: `/Users/ljkirby/repos/burns-app/assets/`
  - `burn-protocol.png` ✅
  - `cold-protocol.png` ✅

---

## Testing Checklist

### Web Testing:
- [ ] AI Analysis camera/upload
- [ ] Calculator (Parkland formula)
- [ ] Protocol viewer with toggle
- [ ] PDF save/share
- [ ] Responsive on mobile browsers

### iOS Testing (Expo Go):
- [ ] Camera functionality
- [ ] Photo library access
- [ ] Calculator inputs
- [ ] Protocol images display
- [ ] PDF generation
- [ ] Share functionality
- [ ] All navigation tabs work

---

## Need Help?

- **Web deployment issues**: See [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **iOS testing**: See [IOS_TESTING_GUIDE.md](IOS_TESTING_GUIDE.md)
- **General deployment**: See [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)
