# PWA Setup Guide - Acumatica Preview

## 🎉 Your Application is Now a PWA!

Your Acumatica Preview application has been successfully converted to a Progressive Web App (PWA). This means users can install it on their mobile devices and use it like a native app.

## ✨ Features Added

### 1. **Installable App**
- Users can install the app on their home screen (iOS/Android)
- Works like a native mobile application
- Custom install prompt appears after 3 seconds
- Install prompt can be dismissed and will reappear after 7 days

### 2. **Offline Support**
- Service worker caches all assets for offline use
- Custom offline page when no internet connection
- Automatic sync when connection is restored
- LocalStorage data persists offline

### 3. **Mobile Optimized**
- Full-screen standalone mode (no browser UI)
- Custom theme colors (red/pink tones)
- iOS splash screens configured
- Apple touch icons for all sizes
- Optimized viewport settings

### 4. **Performance**
- Assets are cached for faster loading
- Images cached for 30 days
- Fonts cached for 1 year
- Automatic cache cleanup

## 📱 Testing Your PWA

### On Desktop (Chrome/Edge)
1. Run the development server: `npm run dev`
2. Open Chrome DevTools (F12)
3. Go to "Application" tab → "Manifest"
4. Verify manifest is loaded correctly
5. Check "Service Workers" section to see if SW is registered
6. Use Lighthouse to run PWA audit

### On Android
1. Build the app: `npm run build`
2. Preview the build: `npm run preview`
3. Deploy to a server with HTTPS (required for PWA)
4. Open in Chrome on Android
5. Look for "Install app" prompt or menu option
6. Install and test offline functionality

### On iOS (Safari)
1. Deploy to HTTPS server
2. Open in Safari on iPhone/iPad
3. Tap the Share button
4. Select "Add to Home Screen"
5. The app will appear on your home screen
6. Test offline functionality

## 🔧 Configuration Files

### Key Files Modified/Created:
- `public/manifest.json` - Web app manifest with icons and metadata
- `vite.config.ts` - PWA plugin configuration with service worker
- `index.html` - PWA meta tags and icon references
- `src/main.tsx` - Service worker registration
- `src/components/InstallPrompt.tsx` - Custom install prompt
- `src/App.tsx` - Integrated install prompt
- `public/offline.html` - Offline fallback page
- `src/vite-env.d.ts` - TypeScript definitions for PWA

### Icons Organized:
- `public/icons/android/` - Android launcher icons (48px to 512px)
- `public/icons/ios/` - iOS app icons (16px to 1024px)

## 🚀 Deployment Requirements

### HTTPS is Required
PWAs require HTTPS to work. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any hosting with SSL certificate

### Build Command
```bash
npm run build
```

### Preview Build Locally
```bash
npm run preview
```

## 📊 PWA Checklist

✅ Web App Manifest configured
✅ Service Worker registered
✅ HTTPS ready (when deployed)
✅ Responsive design
✅ Offline fallback page
✅ Icons for all platforms
✅ Theme colors configured
✅ Install prompt implemented
✅ Caching strategy configured
✅ iOS meta tags added

## 🎨 Customization

### Change Theme Color
Edit `public/manifest.json`:
```json
"theme_color": "#ef4444",
"background_color": "#ffffff"
```

Also update in `index.html`:
```html
<meta name="theme-color" content="#ef4444" />
```

### Modify Install Prompt
Edit `src/components/InstallPrompt.tsx` to customize:
- Appearance
- Timing (currently 3 seconds)
- Dismiss behavior (currently 7 days)

### Update App Name
Edit `public/manifest.json`:
```json
"name": "Your App Name",
"short_name": "Short Name"
```

### Caching Strategy
Edit `vite.config.ts` in the `VitePWA` plugin configuration to modify:
- Cache duration
- Cache patterns
- Runtime caching rules

## 🐛 Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure you're on HTTPS (or localhost)
- Clear browser cache and reload

### Install Prompt Not Showing
- Only works on HTTPS (or localhost)
- User must visit site multiple times
- Some browsers don't support beforeinstallprompt
- Check if already installed

### Icons Not Displaying
- Verify icon paths in manifest.json
- Check that icons exist in public/icons/
- Clear cache and rebuild

### Offline Mode Not Working
- Check service worker is registered
- Verify caching strategy in vite.config.ts
- Test by going offline in DevTools

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## 🎯 Next Steps

1. **Test Thoroughly**: Test on real devices (iOS and Android)
2. **Deploy to HTTPS**: Deploy to a hosting service with SSL
3. **Run Lighthouse Audit**: Check PWA score in Chrome DevTools
4. **Monitor Performance**: Use analytics to track install rates
5. **Gather Feedback**: Get user feedback on the PWA experience

## 💡 Tips

- Test on multiple devices and browsers
- Monitor service worker updates
- Keep manifest.json updated with app changes
- Regularly test offline functionality
- Consider adding push notifications (future enhancement)
- Add app shortcuts for quick actions (already configured)

---

**Congratulations!** Your app is now a fully functional PWA ready for mobile deployment! 🎊
