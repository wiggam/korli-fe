const STORAGE_KEY = 'korli_browser_id';

/**
 * Generates a new browser ID using crypto.randomUUID() and stores it in localStorage.
 * @returns The newly generated browser ID
 */
export const generateBrowserId = (): string => {
  const id = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
};

/**
 * Retrieves the existing browser ID from localStorage, or generates a new one if it doesn't exist.
 * @returns The browser ID (existing or newly generated)
 */
export const getBrowserId = (): string => {
  const existingId = localStorage.getItem(STORAGE_KEY);
  
  if (existingId) {
    return existingId;
  }
  
  return generateBrowserId();
};

