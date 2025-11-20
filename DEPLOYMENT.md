# Nepal Grocery Billing - Deployment Guide

This guide explains how to distribute and install the Nepal Grocery Billing software for your customers.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Building for Production](#building-for-production)
- [Distribution Methods](#distribution-methods)
- [Troubleshooting](#troubleshooting)
- [Future: Online Deployment](#future-online-deployment)

---

## Prerequisites

### For Development/Building
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### For Customers (Method 1 & 2)
- Modern web browser (Chrome, Edge, Firefox recommended)
- No internet required after installation (fully offline)

---

## Building for Production

### Step 1: Build the Application

```bash
# Navigate to project directory
cd nepal-grocery-billing

# Install dependencies (if not already done)
npm install

# Build production version
npm run build
```

This creates an optimized `dist` folder with all compiled files.

### Step 2: Test the Build Locally

```bash
# Install a simple HTTP server (one-time)
npm install -g serve

# Serve the built app
serve -s dist

# Open browser to http://localhost:3000
```

---

## Distribution Methods

### Method 1: Static Build (Simplest)

**Best for:** Quick deployment, USB distribution

1. **Package the `dist` folder:**
   - Copy the entire `dist` folder
   - Rename to `NepalGroceryBilling`
   - Compress to ZIP (optional)

2. **Customer Installation:**
   ```bash
   # Extract folder anywhere on computer
   # Install local server (one-time)
   npm install -g serve
   
   # Navigate to app folder
   cd NepalGroceryBilling
   
   # Run application
   serve -s .
   ```

3. **Customer Usage:**
   - Open browser to `http://localhost:3000`
   - Bookmark this URL for easy access
   - Data saved locally in browser (IndexedDB)

**⚠️ IMPORTANT:** Customers must not clear browser cache/cookies for this site, or they'll lose all data.

---

### Method 2: Electron Desktop App (Recommended)

**Best for:** Professional deployment, desktop application feel

#### Step 1: Install Electron Builder

```bash
npm install --save-dev electron electron-builder
```

#### Step 2: Create Electron Configuration

Create `electron.js` in project root:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'icon.png'), // Add your icon
  });

  win.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, 'dist/index.html')}`
  );

  // Remove menu bar for cleaner look
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

#### Step 3: Update `package.json`

Add to `package.json`:

```json
{
  "main": "electron.js",
  "scripts": {
    "electron": "electron .",
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.nepalgrocery.billing",
    "productName": "Nepal Grocery Billing",
    "files": [
      "dist/**/*",
      "electron.js"
    ],
    "win": {
      "target": "nsis",
      "icon": "icon.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

#### Step 4: Build Windows Installer

```bash
npm install electron-is-dev

# Build the installer
npm run electron:build
```

This creates:
- `dist-electron/Nepal Grocery Billing Setup.exe` (installer)
- Total size: ~150-200 MB

#### Step 5: Distribute to Customers

1. Send customers the `.exe` installer file
2. Customer double-clicks installer
3. Follow installation wizard
4. Desktop shortcut created automatically
5. Launch app like any Windows application

**Advantages:**
- ✅ One-click installation
- ✅ Desktop application (no browser needed)
- ✅ Auto-updates possible (future)
- ✅ Professional appearance
- ✅ Data persists automatically

---

### Method 3: Progressive Web App (PWA)

**Best for:** Future online deployment

The app is already PWA-ready (uses modern APIs). When hosted online:

1. Visit website
2. Click "Install" in browser
3. App installs like native app
4. Works offline after first visit

*(Not fully implemented yet - coming soon)*

---

## Offline Capabilities

✅ **Fully Offline:** Works without internet after installation  
✅ **Local Storage:** All data stored in browser (IndexedDB)  
✅ **Fast:** No network latency  
⚠️ **Data Warning:** Data stored locally - customers must backup regularly

---

## Troubleshooting

### Issue: "Application won't start"
- **Cause:** Browser compatibility
- **Fix:** Use Chrome or Edge (recommended browsers)

### Issue: "Data disappeared"
- **Cause:** Browser cache cleared
- **Fix:** Warn customers NEVER to clear browser data for this site
- **Prevention:** Use Electron desktop app (Method 2)

### Issue: "Can't access from multiple computers"
- **Cause:** Local-only storage currently
- **Fix:** Install separately on each computer, OR wait for online version (future)

### Issue: "Installation file too large"
- **Cause:** Electron bundles Chromium (~150MB)
- **Fix:** Use Method 1 (static build) for smaller size, or host online (future)

---

## Future: Online Deployment

### When Ready for Cloud:

#### Step 1: Choose Hosting Platform
- **Free Options:** Vercel, Netlify, GitHub Pages
- **Paid Options:** AWS, Azure, DigitalOcean

#### Step 2: Deploy Frontend

```bash
# Example for Vercel (free)
npm install -g vercel
vercel login
vercel --prod
```

#### Step 3: Migrate Database
- Replace IndexedDB with cloud database:
  - **Options:** Firebase, Supabase, MongoDB Atlas
  - **Benefits:** Multi-device sync, real-time updates, backups

#### Step 4: Add Authentication
- User login system
- Multi-store support
- Role-based access (admin, cashier)

---

## Support

### For Technical Issues
- Contact: Sangam Baral
- Email: [Your Email]

### For Updates
- Version tracking via Git tags
- Release notes in `CHANGELOG.md`
- Future: Auto-update via Electron

---

## Quick Reference

| Method | Size | Installation | Best For |
|--------|------|--------------|----------|
| Static Build | ~5 MB | Manual | Quick distribution |
| Electron App | ~150 MB | Installer | Professional deployment |
| PWA (Future) | ~5 MB | Browser install | Online version |

---

**Last Updated:** 2025-11-20  
**Version:** 1.0.0  
**© 2025 SangamBaral**
