export const fetchWithCache = async (url, cacheKey, expiryMinutes = 60) => {
  // Check if data exists in cache and is not expired
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    const now = new Date().getTime();
    const expiryTime = expiryMinutes * 60 * 1000; // Convert minutes to milliseconds

    // If data is not expired, return it
    if (now - timestamp < expiryTime) {
      return data;
    }
  }

  // If no cached data or expired, fetch from API
  const response = await fetch(url);
  const data = await response.json();

  // Store in cache with timestamp
  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      data,
      timestamp: new Date().getTime(),
    })
  );

  return data;
};
