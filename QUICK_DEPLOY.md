# Quick Deploy Guide

## Easiest Option: Deploy to Netlify (Free, 2 minutes)

### Step 1: Build for Web
```bash
npx expo export --platform web
```

This creates a `dist` folder with your web app.

### Step 2: Deploy to Netlify

**Option A: Drag & Drop (No account needed initially)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `dist` folder onto the page
3. Get instant URL like: `https://yourapp.netlify.app`

**Option B: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --dir=dist --prod
```

### Step 3: Share the URL
- Anyone can visit the URL in their browser
- Works on desktop, tablets, and mobile browsers
- Full functionality including camera on mobile browsers

---

## Alternative: Vercel (Also Free & Easy)

```bash
# Install Vercel CLI
npm install -g vercel

# Build
npx expo export --platform web

# Deploy
vercel --prod dist
```

---

## For Mobile App Testing: Expo Go

If you want people to test on the actual Expo Go app:

1. Keep `npm start` running
2. You'll see a QR code in the terminal
3. Share the QR code or the `exp://` URL
4. Users scan it with Expo Go app (download from App/Play Store)

**Note:** This only works while your dev server is running and only on the same network (or using Expo's tunnel service).

---

## Recommended: Netlify Drag & Drop

This is the fastest way:
1. `npx expo export --platform web`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag `dist` folder
4. Get shareable URL immediately
