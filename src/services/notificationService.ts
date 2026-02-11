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
    return 'Notification' in window && this.permission === 'granted';
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    return this.permission;
  }

  /**
   * Show a notification
   */
  async showNotification(options: NotificationOptions): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported or permission not granted');
      return;
    }

    try {
      // Check if service worker is available for better notification support
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Use service worker to show notification (better for PWA)
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/android/android-launchericon-192-192.png',
          badge: options.badge || '/icons/android/android-launchericon-96-96.png',
          tag: options.tag,
          data: options.data,
          requireInteraction: false,
        } as any);
      } else {
        // Fallback to regular notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/android/android-launchericon-192-192.png',
          badge: options.badge || '/icons/android/android-launchericon-96-96.png',
          tag: options.tag,
          data: options.data,
        } as any);
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
