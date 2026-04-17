import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.41e6b41ee506422db0ca1b8420a68a48',
  appName: 'Bunifu',
  webDir: 'dist',
  server: {
    // Hot-reload from the Lovable sandbox preview during development.
    // Remove the `url` field before building a production binary for the stores.
    url: 'https://41e6b41e-e506-422d-b0ca-1b8420a68a48.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DEFAULT',
    },
  },
};

export default config;
