// Custom Service Worker for Push Notifications
// This extends the Workbox service worker with notification handling

// Listen for push events (for future push notification support)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'You have a new notification',
      icon: data.icon || '/icons/android/android-launchericon-192-192.png',
      badge: data.badge || '/icons/android/android-launchericon-96-96.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      requireInteraction: false,
      silent: false
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Acu Preview', options)
    );
  }
});

// Listen for notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle notification close events
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});

// Message handler for communication with the app
self.addEventListener('message', (event) => {
  console.log('Service worker received message:', event.data);
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    
    self.registration.showNotification(title, {
      ...options,
      icon: options.icon || '/icons/android/android-launchericon-192-192.png',
      badge: options.badge || '/icons/android/android-launchericon-96-96.png',
      vibrate: options.vibrate || [200, 100, 200],
      silent: false,
      requireInteraction: false
    }).then(() => {
      console.log('Notification shown successfully via message');
    }).catch((error) => {
      console.error('Error showing notification via message:', error);
    });
  }
});

console.log('Custom service worker loaded');
