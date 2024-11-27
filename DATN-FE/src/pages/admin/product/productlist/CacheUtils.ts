export const CACHE_KEYS = {
    PRODUCTS: 'cached_products',
    CATEGORIES: 'cached_categories', 
    BRANDS: 'cached_brands',
    SIZES: 'cached_sizes',
    COLORS: 'cached_colors',
    PRODUCT_DETAILS: 'cached_product_details'
  };
  
  export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  export const getCache = <T>(key: string): T | null => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
  
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  };
  
  export const setCache = <T>(key: string, data: T): void => {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now()
      })
    );
  };
  
  export const clearProductCaches = () => {
    Object.values(CACHE_KEYS).forEach(key => {
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(storageKey => {
        if (storageKey.startsWith(key)) {
          localStorage.removeItem(storageKey);
        }
      });
    });
  };