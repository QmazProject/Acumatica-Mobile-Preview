// Notification Service for PWA Push Notifications

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      console.warn('Notification permission was denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        console.log('Notification permission granted');
        return true;
      } else {
        console.warn('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Check if notifications are supported and permission is granted
   */
  isSupported(): boolean {
    // Update permission state from browser
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
    return 'Notification' in window && this.permission === 'granted';
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
    return this.permission;
  }

  /**
   * Show a notification
   */
  async showNotification(options: NotificationOptions): Promise<void> {
    // Update permission state before checking
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
    
    if (!this.isSupported()) {
      console.warn('Notifications are not supported or permission not granted. Current permission:', this.permission);
      return;
    }

    console.log('Showing notification:', options.title);

    try {
      const notificationOptions = {
        body: options.body,
        icon: options.icon || '/icons/android/android-launchericon-192-192.png',
        badge: options.badge || '/icons/android/android-launchericon-96-96.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: false,
        silent: false,
        vibrate: [200, 100, 200],
      };

      // Check if service worker is available for better notification support
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          console.log('Service worker is ready, showing notification');
          
          // Try to show notification via service worker
          await registration.showNotification(options.title, notificationOptions as any);
          console.log('Notification sent successfully via service worker');
          
          // Also send a message to the service worker as backup
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SHOW_NOTIFICATION',
              title: options.title,
              options: notificationOptions
            });
          }
        } catch (swError) {
          console.warn('Service worker notification failed, falling back to regular notification:', swError);
          // Fallback to regular notification
          new Notification(options.title, notificationOptions as any);
          console.log('Notification sent successfully via fallback');
        }
      } else {
        // Fallback to regular notification
        console.log('Using regular notification (no service worker)');
        new Notification(options.title, notificationOptions as any);
        console.log('Notification sent successfully');
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Show notification for PO Approval
   */
  async notifyPOApproval(): Promise<void> {
    await this.showNotification({
      title: 'New PO for Approval',
      body: 'You have 1 new Purchase Order pending approval',
      tag: 'po-approval',
      data: { type: 'po', action: 'approval' }
    });
  }

  /**
   * Show notification for Bill Approval
   */
  async notifyBillApproval(): Promise<void> {
    await this.showNotification({
      title: 'New Bill for Approval',
      body: 'You have 1 new Bill pending approval',
      tag: 'bill-approval',
      data: { type: 'bill', action: 'approval' }
    });
  }

  /**
   * Show notification for Prepayment Approval
   */
  async notifyPrepaymentApproval(): Promise<void> {
    await this.showNotification({
      title: 'New Prepayment for Approval',
      body: 'You have 1 new Prepayment pending approval',
      tag: 'prepayment-approval',
      data: { type: 'prepayment', action: 'approval' }
    });
  }

  /**
   * Show notification for Purchases
   */
  async notifyPurchases(): Promise<void> {
    await this.showNotification({
      title: 'Purchases Enabled',
      body: 'You can now view and manage purchases',
      tag: 'purchases-enabled',
      data: { type: 'purchases', action: 'enabled' }
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
