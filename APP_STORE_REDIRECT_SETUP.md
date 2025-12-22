# App Store Redirect Setup Guide

## Overview

This setup will redirect users to the App Store when they click on a Universal Link and the app is not installed on their iOS device.

## Step 1: Get Your App Store ID

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Find your app
3. Copy the **App ID** (numeric ID, e.g., `1234567890`)
4. This is different from your Bundle Identifier

## Step 2: Update the HTML File

1. Open `web-redirect-page.html`
2. Replace `YOUR_APP_STORE_ID` with your actual App Store ID in two places:
   - Line 8: `<meta name="apple-itunes-app" content="app-id=YOUR_APP_STORE_ID">`
   - Line 40: `const APP_STORE_ID = 'YOUR_APP_STORE_ID';`

## Step 3: Upload to Your Server

You have two options:

### Option A: Create a Dedicated Redirect Page (Recommended)

1. Upload `web-redirect-page.html` to your server
2. Place it at: `https://zannysfood.com/app/ProductDetail/redirect.html`
3. Update your server to redirect `/app/ProductDetail/*` to this page when the app is not installed

### Option B: Server-Side Redirect (Better Solution)

Create a server-side script (PHP/Node.js/etc.) that:

1. Detects if the request is from iOS
2. Tries to determine if the app is installed
3. Redirects to App Store if app is not installed
4. Otherwise, serves the Universal Link

**Example PHP script** (`app/ProductDetail/index.php`):

```php
<?php
$productId = basename($_SERVER['REQUEST_URI']);
$isIOS = preg_match('/iPad|iPhone|iPod/', $_SERVER['HTTP_USER_AGENT']);
$appStoreId = 'YOUR_APP_STORE_ID';
$appStoreUrl = "https://apps.apple.com/app/id{$appStoreId}";

if ($isIOS) {
    // Try to open app, then redirect to App Store
    header('Location: ' . $appStoreUrl);
    exit;
} else {
    // Not iOS, show web version or redirect
    header('Location: ' . $appStoreUrl);
    exit;
}
?>
```

## Step 4: Update apple-app-site-association File

Your `apple-app-site-association` file should remain the same. It tells iOS which paths can open in the app.

## Step 5: How It Works

1. **User clicks link**: `https://zannysfood.com/app/ProductDetail/123`
2. **iOS checks**: Is app installed?
   - **If YES**: Opens app directly (Universal Link works)
   - **If NO**: Opens in Safari
3. **Safari loads**: The redirect page
4. **JavaScript detects**: iOS device
5. **Tries to open app**: Using `zannysfood://app/ProductDetail/123`
6. **If app opens**: User sees the app
7. **If app doesn't open** (after 2.5 seconds): Redirects to App Store

## Step 6: Testing

1. **Delete the app** from your iOS device
2. **Click a shared link**: `https://zannysfood.com/app/ProductDetail/123`
3. **Should redirect**: To App Store after a brief moment
4. **Install the app**: From App Store
5. **Click link again**: Should now open directly in the app

## Alternative: Smart App Banner

You can also use Apple's Smart App Banner by adding this to your web pages:

```html
<meta name="apple-itunes-app" content="app-id=YOUR_APP_STORE_ID">
```

This shows a banner at the top of Safari prompting users to open in the app or go to the App Store.

## Important Notes

- **App Store ID is required**: You must have your app published on the App Store or at least have an App Store ID
- **Test thoroughly**: Test on actual iOS devices, not just simulators
- **Fallback behavior**: If JavaScript is disabled, the page should still redirect to App Store
- **Universal Links still work**: If the app is installed, Universal Links will open the app directly (bypassing the web page)

## Troubleshooting

**Issue**: Redirect doesn't work
- **Solution**: Check that JavaScript is enabled and the App Store ID is correct

**Issue**: Always redirects to App Store even when app is installed
- **Solution**: This shouldn't happen - Universal Links should open the app directly. Check your `apple-app-site-association` file.

**Issue**: Page shows but doesn't redirect
- **Solution**: Check browser console for JavaScript errors

