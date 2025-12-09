# Deployment Options for Burns App

## Option 1: Expo Snack (Web-based demo)

### Limitations:
- Local images (assets/burn-protocol.png, assets/cold-protocol.png) need to be hosted online
- Camera functionality may be limited in web preview

### Steps:
1. Host your protocol images online (GitHub, Imgur, or any image host)
2. Go to [snack.expo.dev](https://snack.expo.dev)
3. Upload your files or copy/paste the code
4. Update image references to use URLs instead of local files
5. Share the generated Snack URL

## Option 2: Expo Publish (Recommended)

This creates a hosted version that works on iOS/Android/Web with full functionality.

### Steps:

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   npx expo login
   ```
   (Create a free account at expo.dev if you don't have one)

3. **Configure your app**:
   ```bash
   npx expo install expo-dev-client
   ```

4. **Publish your app**:
   ```bash
   npx expo publish
   ```

5. **Get the URL**:
   After publishing, you'll get a URL like:
   - Web: `https://yourapp.expo.dev`
   - QR code for mobile testing

### Benefits:
- Full camera functionality
- Works on iOS, Android, and Web
- Can scan QR code on real devices
- Free hosting from Expo

## Option 3: Build and Deploy to Web

Deploy as a standalone website:

1. **Export for web**:
   ```bash
   npx expo export --platform web
   ```

2. **Deploy to hosting service**:
   - Upload the `dist` folder to:
     - Netlify (drag & drop)
     - Vercel
     - GitHub Pages
     - Any static host

## Quick Start: Expo Publish (Most Popular)

Run these commands:

```bash
# 1. Login to Expo (create account if needed)
npx expo login

# 2. Publish your app
npx expo publish

# 3. The CLI will give you:
#    - A web URL (works in browser)
#    - A QR code (scan with Expo Go app on your phone)
```

After publishing, anyone can:
- Visit the web URL in their browser
- Scan the QR code with the **Expo Go** app (download from App Store/Play Store)

## Testing Before Publishing

Start the dev server:
```bash
npm start
```

Then:
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your phone
- Press `i` for iOS simulator (if on Mac)
- Press `a` for Android emulator (if installed)
