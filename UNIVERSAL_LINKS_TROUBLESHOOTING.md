# Universal Links Troubleshooting Guide

## Issue: Link Still Opens App After Deleting It

If Universal Links are still trying to open the app after you've deleted it, here are the steps to resolve this:

### Step 1: Verify App is Completely Deleted

1. **Check Home Screen**: Make sure the app icon is completely gone
2. **Check App Library**: Swipe left on your home screen and search for the app
3. **Check Settings**: Go to Settings > General > iPhone Storage and verify the app is not listed

### Step 2: Clear iOS Universal Link Cache

iOS caches Universal Link associations. To clear it:

1. **Delete the app** (if still installed)
2. **Restart your device** (hold power + volume down until Apple logo appears)
3. **Wait 5-10 minutes** after restart (iOS needs time to clear the cache)
4. **Try the link again**

### Step 3: Verify Server Configuration

Your `apple-app-site-association` file must be:
- Accessible at: `https://zannysfood.com/.well-known/apple-app-site-association`
- Served with `Content-Type: application/json` header
- Have NO file extension (not `.json`)
- Be valid JSON format

**Test the file:**
```bash
curl -I https://zannysfood.com/.well-known/apple-app-site-association
```

Should return:
```
Content-Type: application/json
```

### Step 4: Check AASA File Content

The file should look like this (replace TEAMID with your actual Team ID):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.org.reactjs.native.example.Zanny-Customer",
        "paths": [
          "/app/ProductDetail/*"
        ]
      }
    ]
  }
}
```

### Step 5: Force iOS to Re-fetch AASA File

1. Delete the app
2. Restart device
3. Wait 10 minutes
4. Open Safari and manually visit: `https://zannysfood.com/.well-known/apple-app-site-association`
5. This forces iOS to fetch the file again
6. Then try your Universal Link

### Step 6: Test in Different Contexts

**Test 1: From Safari**
- Open Safari
- Type or paste: `https://zannysfood.com/app/ProductDetail/123`
- If app is deleted, it should stay in Safari
- If app is installed, it should open the app

**Test 2: From Messages/Email**
- Send yourself the link via Messages
- Tap the link
- If app is deleted, it should open in Safari
- If app is installed, it should open the app

**Test 3: Long Press the Link**
- Long press on the link
- You should see options including "Open in Safari"
- This confirms it's a Universal Link

### Important Notes

1. **Universal Links are iOS-controlled**: The app code cannot control whether links open in Safari or the app - this is entirely handled by iOS based on:
   - Whether the app is installed
   - The `apple-app-site-association` file on your server
   - iOS's cached associations

2. **Custom URL Schemes vs Universal Links**:
   - `zannysfood://app/ProductDetail/123` = Custom URL scheme (always tries to open app)
   - `https://zannysfood.com/app/ProductDetail/123` = Universal Link (opens app if installed, Safari if not)

3. **If app keeps reinstalling**:
   - Check if iCloud Backup is restoring the app
   - Check if App Store is auto-downloading the app
   - Disable automatic app downloads in Settings > App Store

### Still Not Working?

If after all these steps the link still tries to open the app:

1. **Verify AASA file is accessible**: Visit the URL directly in Safari
2. **Check file format**: Ensure it's valid JSON (use a JSON validator)
3. **Check server headers**: Ensure `Content-Type: application/json` is set
4. **Contact Apple Support**: There might be an iOS bug or caching issue

### Expected Behavior

✅ **App Installed**: Universal Link opens in app  
✅ **App Deleted**: Universal Link opens in Safari (after cache clears)  
❌ **App Deleted but link opens app**: This shouldn't happen - indicates caching or configuration issue


