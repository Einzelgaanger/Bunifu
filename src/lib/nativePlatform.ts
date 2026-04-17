import { Capacitor } from '@capacitor/core';

/**
 * Initialise native-only behaviour (status bar styling, hiding the splash screen).
 * Safe to call on web — it just no-ops when not running inside a Capacitor shell.
 */
export async function initNativePlatform() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Default });
  } catch (err) {
    console.warn('StatusBar init failed', err);
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch (err) {
    console.warn('SplashScreen hide failed', err);
  }
}

export const isNative = () => Capacitor.isNativePlatform();
export const nativePlatform = () => Capacitor.getPlatform(); // 'web' | 'ios' | 'android'
