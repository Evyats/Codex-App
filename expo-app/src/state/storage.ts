import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadJSON<T>(key: string): Promise<T | undefined> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[storage] Failed to load ${key}`, error);
    return undefined;
  }
}

export async function saveJSON(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] Failed to save ${key}`, error);
  }
}
