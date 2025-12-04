import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export const usePersistentState = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          setState(JSON.parse(storedValue));
        }
      } catch (error) {
        console.error(`Error loading state for key "${key}":`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadState();
  }, [key]);

  const setPersistentState = async (value: T | ((prev: T) => T)) => {
    try {
      const newValue = value instanceof Function ? value(state) : value;
      setState(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error saving state for key "${key}":`, error);
    }
  };

  return [state, setPersistentState, isLoaded] as const;
};
