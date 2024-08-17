import { useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const value = localStorage.getItem(key);
    return !value ? initialValue : (JSON.parse(value) as T);
  });

  const setValue = (value: T) => {
    const valueToStore =
      typeof value === "function" ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
