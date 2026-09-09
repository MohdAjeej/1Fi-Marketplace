import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback when native module is unavailable
const memoryStore: Record<string, string> = {};
let useMemoryFallback = false;

async function checkAvailability(): Promise<boolean> {
  if (useMemoryFallback) return false;
  try {
    // Quick test to see if native module is accessible
    await AsyncStorage.getItem('__storage_test__');
    return true;
  } catch {
    useMemoryFallback = true;
    console.warn('AsyncStorage native module unavailable, using in-memory fallback.');
    return false;
  }
}

export const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    const available = await checkAvailability();
    if (available) {
      return AsyncStorage.getItem(key);
    }
    return memoryStore[key] ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    const available = await checkAvailability();
    if (available) {
      await AsyncStorage.setItem(key, value);
    } else {
      memoryStore[key] = value;
    }
  },

  async removeItem(key: string): Promise<void> {
    const available = await checkAvailability();
    if (available) {
      await AsyncStorage.removeItem(key);
    } else {
      delete memoryStore[key];
    }
  },
};
