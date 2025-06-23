import * as Notifications from "expo-notifications";
import { isRunningInExpoGo } from "expo";

let warned = false;

/**
 * Register for push notifications if running outside Expo Go.
 * When running in Expo Go, this will warn the developer and resolve to null.
 */
export async function registerForPushNotificationsAsync() {
  if (isRunningInExpoGo()) {
    if (!warned) {
      console.warn(
        "Push notifications are not supported in Expo Go. Use a development build instead."
      );
      warned = true;
    }
    return null;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const result = await Notifications.requestPermissionsAsync();
    if (result.status !== "granted") {
      return null;
    }
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token;
  } catch {
    return null;
  }
}

export function addPushNotificationReceivedListener(
  listener: (event: Notifications.Notification) => void
) {
  if (isRunningInExpoGo()) {
    if (__DEV__ && !warned) {
      console.warn(
        "Skipping push notification listener because app runs in Expo Go."
      );
      warned = true;
    }
    return { remove: () => {} } as Notifications.Subscription;
  }

  return Notifications.addNotificationReceivedListener(listener);
}

// Re-export commonly used local notification APIs
export const {
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
} = Notifications;
