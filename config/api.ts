// API Configuration for 1Fi Marketplace

// Update this with your computer's IP address
// To find your IP: Run 'ipconfig' in terminal and look for IPv4 Address
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.29.166:3000/api'  // Development - your local IP
  : 'https://api.1fi.in/api';         // Production

export const API_TIMEOUT = 30000; // 30 seconds

// Auth token management using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@1fi_auth_token';

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

export const clearAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

export const apiHeaders = async () => {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};
