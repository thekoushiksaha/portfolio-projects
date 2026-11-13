import { Linking } from 'react-native';

export async function openUrl(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch {
    // nothing on this device can open the link; ignore
  }
}
