import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.followme.app',
  appName: 'FollowMe',
  webDir: 'out',
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
