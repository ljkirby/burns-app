# Burns App

A React Native mobile application for analyzing burn and frostbite injuries using AI. Compatible with iOS and Android phones and tablets.

## Features

### AI Analysis Screen
- Take or upload multiple photos of burn/frostbite injuries
- Analyze images with AI
- View detailed analysis results including:
  - Image quality score
  - Total burn surface area percentage
  - Burn depth classification
  - Critical burn alerts
- Save results to photos or share with others
- Confirmation dialog before closing to prevent accidental data loss

### Calculator Screen
- Coming soon

### Protocol Screen
- Coming soon

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your physical device (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ljkirby/burns-app.git
cd burns-app
```

2. Install dependencies:
```bash
npm install
```

3. Add placeholder assets (optional):
Create the following image files in the `assets` directory:
- `icon.png` (1024x1024)
- `splash.png` (2048x2048)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

Or the app will use default Expo assets.

## Running the App

### Start the development server:
```bash
npm start
```

### Run on iOS Simulator (Mac only):
```bash
npm run ios
```

### Run on Android Emulator:
```bash
npm run android
```

### Run on Physical Device:
1. Install the Expo Go app from the App Store or Google Play Store
2. Scan the QR code shown in the terminal with the Expo Go app

## Project Structure

```
burns-app/
├── App.js                 # Main app entry with navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── assets/               # Images and static assets
└── screens/
    ├── AIAnalysisScreen.js    # Main analysis screen
    ├── CalculatorScreen.js    # Calculator placeholder
    └── ProtocolScreen.js      # Protocol placeholder
```

## Permissions

The app requires the following permissions:
- Camera access (to take photos)
- Photo library access (to upload and save photos)

## Technologies Used

- React Native
- Expo
- React Navigation (Bottom Tabs)
- Expo Image Picker
- Expo Media Library
- Expo Sharing
- React Native View Shot

## Future Development

- Implement calculator functionality for burn surface area calculations
- Add protocol/flowchart screen for burn treatment guidelines
- Integrate actual AI model for burn analysis
- Add user authentication and data persistence
- Implement medical record export features

## License

ISC
