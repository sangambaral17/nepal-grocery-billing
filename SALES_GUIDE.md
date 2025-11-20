# Nepal Grocery Billing Software - Sales & User Guide

## 🚀 Introduction
This is a premium, offline-first billing software designed specifically for local grocery shops (Kirana Pasals) in Nepal. It replaces traditional paper registers with a modern, digital system that works **without internet**.

---

## 💰 How to Sell This Software
**Target Audience:** Local Kirana Pasals, Mini-marts, Wholesalers.

### The Pitch (Why they need it):
1.  **"No Internet Needed"**: This is your biggest selling point. Most shop owners worry about internet costs or reliability. This works 100% offline.
2.  **"Stop Math Errors"**: Manual calculation leads to losses. This software calculates totals, discounts, and VAT automatically.
3.  **"Track Your Stock"**: Know exactly how many packets of Wai Wai or rice sacks are left without counting manually.
4.  **"Professional Receipts"**: Give customers a printed bill or send it via WhatsApp. It looks professional and builds trust.
5.  **"One-Time Cost"**: Unlike other software with monthly fees, you can sell this for a one-time setup fee (e.g., Rs. 5,000 - 10,000).

### Pricing Strategy:
-   **Software License**: Rs. 5,000 - Rs. 15,000 (One-time).
-   **Installation & Training**: Rs. 1,000 - Rs. 2,000.
-   **Annual Support (Optional)**: Rs. 2,000/year for updates/fixes.

---

## 📖 User Manual (How to Use)

### 1. Getting Started
-   Open the app on your computer or tablet.
-   Go to **Settings** to set your Store Name and Address. This will appear on all receipts.

### 2. Adding Inventory (Products)
-   Go to **Inventory** tab.
-   Click **+ Add Product**.
-   **Barcode**: Scan the product barcode (or type a code like '1001').
-   **Name**: E.g., "Coca Cola 500ml".
-   **Price**: Selling Price (Rs. 60).
-   **Cost Price**: Your buying price (Rs. 50) - *Used for profit calculation (future update)*.
-   **Stock**: How many you have (e.g., 50).

### 3. Making a Sale (POS)
-   Go to **POS (Billing)**.
-   **Scan/Search**: Type the product name or scan the barcode.
-   Click the product to add it to the cart.
-   Adjust quantity with **+** or **-**.
-   Click **Checkout**.
-   Choose Payment: **Cash**, **Card**, or **QR**.
-   Click **Confirm Payment**.

### 4. Managing Customers
-   Go to **Customers**.
-   Add loyal customers with their phone numbers.
-   (Future Update: You will be able to link sales to customers for credit/udharo).

### 5. Viewing History
-   Go to **Sales History**.
-   See all past bills.
-   Click **View** to see details.
-   Click **WhatsApp** to share the bill with the customer.

---

## ⚠️ Important Notes for Shop Owners
-   **Data Safety**: Data is stored in this browser. **DO NOT** uninstall the browser or clear "Site Data" without exporting your data first.
-   **Backup**: We recommend keeping a weekly backup (feature coming soon).

---

## 🛠 Technical Guide: How to Distribute & Update

### 1. How to Create the Software File (Build)
You do **NOT** give the customer the code. You give them the **App**.
1.  Open your terminal in the project folder.
2.  Run this command:
    ```bash
    npm run build
    ```
3.  This creates a **`dist`** folder. This folder IS the software.

### 2. How to Install on Customer's Laptop
1.  Copy the **`dist`** folder to their computer (e.g., `C:\GroceryApp`).
2.  Install a simple server (one-time setup):
    -   Install Node.js on their laptop.
    -   Run: `npm install -g serve`
3.  Create a shortcut on their Desktop:
    -   Target: `serve -s C:\GroceryApp`
    -   Name: "Grocery Billing Software"
4.  When they click it, it opens in the browser (Chrome/Edge).
5.  **Pro Tip**: In Chrome, click "Three Dots > Save and Share > Install Nepal Grocery Billing". This makes it look like a real desktop app!

### 3. How to Send Updates
If you add new features (like we just added Customers):
1.  Run `npm run build` on your computer again.
2.  Send them the **new** `dist` folder.
3.  Replace the old `dist` folder on their laptop.
4.  **Done!** Their data (sales, products) is safe because it's stored in the Browser Database, not in the `dist` folder.

---

**Copyright © 2025 SangamBaral**
