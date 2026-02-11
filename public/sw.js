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
  console.log('Notification data:', event.notification.data);
  
  event.notification.close();

  // Get the notification data to determine where to navigate
  const notificationData = event.notification.data || {};
  const notificationType = notificationData.type; // 'po', 'bill', 'prepayment', 'purchases'
  
  console.log('Notification type:', notificationType);
  
  // Determine the URL based on notification type - use full URL with origin
  const origin = self.location.origin;
  let targetUrl = origin + '/';
  
  if (notificationType === 'po' || notificationType === 'bill' || notificationType === 'prepayment') {
    // Navigate to approvals screen with type parameter
    targetUrl = `${origin}/?view=approvals&type=${notificationType}`;
  } else if (notificationType === 'purchases') {
    // Navigate to purchases screen
    targetUrl = `${origin}/?view=purchases`;
  }

  console.log('Target URL:', targetUrl);

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    }).then((clientList) => {
      console.log('Found clients:', clientList.length);
      
      // Check if any window is already open
      for (const client of clientList) {
        console.log('Client URL:', client.url);
        
        if (client.url.startsWith(origin)) {
          console.log('Found existing client, navigating...');
          
          // Navigate the existing client to the target URL
          return client.navigate(targetUrl).then(() => {
            console.log('Navigation successful, focusing client');
            return client.focus();
          }).catch((error) => {
            console.error('Navigation failed:', error);
            // If navigation fails, try postMessage as fallback
            client.postMessage({
              type: 'NAVIGATE',
              view: notificationType === 'purchases' ? 'purchases' : 'approvals',
              notificationType: notificationType
            });
            return client.focus();
          });
        }
      }
      
      // No existing client found, open a new window
      console.log('No existing client, opening new window');
      if (clients.openWindow) {
        return clients.openWindow(targetUrl).then((client) => {
          console.log('New window opened:', client);
          return client;
        }).catch((error) => {
          console.error('Failed to open window:', error);
        });
      }
    }).catch((error) => {
      console.error('Error in notificationclick handler:', error);
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
