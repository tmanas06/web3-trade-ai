// Types for OKX API responses
interface TickerData {
  instId: string;
  last: string;
  lastSz: string;
  askPx: string;
  askSz: string;
  bidPx: string;
  bidSz: string;
  open24h: string;
  high24h: string;
  low24h: string;
  volCcy24h: string;
  vol24h: string;
  sodUtc0: string;
  sodUtc8: string;
  ts: string;
}

// Export the TickerData type for use in other files
export type { TickerData };

// Use a CORS proxy to avoid CORS issues
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const OKX_API_BASE = 'https://www.okx.com';
const API_PATH = '/api/v5/market';

/**
 * Makes a fetch request with error handling and retry logic
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<any> {
  const fullUrl = url.startsWith('http') ? url : `${OKX_API_BASE}${url}`;
  const proxyUrl = `${CORS_PROXY}${fullUrl}`;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[OKX] Fetching: ${fullUrl}`);
      const response = await fetch(proxyUrl, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          ...options.headers,
        },
      });

      console.log(`[OKX] Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[OKX] HTTP Error:', response.status, response.statusText, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== '0') {
        console.error('[OKX] API Error:', data.msg || 'Unknown error');
        throw new Error(data.msg || 'API error');
      }
      
      return data;
    } catch (error) {
      console.error(`[OKX] Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error; // If this was the last attempt, rethrow
      
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = 1000 * Math.pow(2, i);
      console.log(`[OKX] Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

/**
 * Fetches all tickers from OKX API
 */
export const fetchTickers = async (instType: string = 'SPOT'): Promise<TickerData[]> => {
  try {
    console.log(`[OKX] Fetching all ${instType} tickers...`);
    const data = await fetchWithRetry(`${API_PATH}/tickers?instType=${instType}`);
    
    if (!Array.isArray(data.data)) {
      console.error('[OKX] Invalid response format:', data);
      throw new Error('Invalid response format from OKX API');
    }
    
    console.log(`[OKX] Fetched ${data.data.length} tickers`);
    return data.data;
  } catch (error) {
    console.error('[OKX] Error in fetchTickers:', error);
    throw error;
  }
};

/**
 * Fetches a single ticker by instrument ID
 */
export const fetchTicker = async (instId: string): Promise<TickerData | null> => {
  try {
    console.log(`[OKX] Fetching ticker for ${instId}...`);
    const data = await fetchWithRetry(`${API_PATH}/ticker?instId=${instId}`);
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error(`[OKX] No data for ${instId}`);
      return null;
    }
    
    return data.data[0];
  } catch (error) {
    console.error(`[OKX] Error in fetchTicker(${instId}):`, error);
    return null;
  }
};

/**
 * Calculates the 24h price change percentage
 */
export const get24hChangePercentage = (ticker: TickerData): number => {
  if (!ticker.open24h || !ticker.last) {
    console.warn('[OKX] Missing price data for 24h change calculation');
    return 0;
  }
  
  try {
    const open = parseFloat(ticker.open24h);
    const last = parseFloat(ticker.last);
    
    if (isNaN(open) || isNaN(last)) {
      console.warn('[OKX] Invalid price values:', { open: ticker.open24h, last: ticker.last });
      return 0;
    }
    
    return ((last - open) / open) * 100;
  } catch (error) {
    console.error('[OKX] Error calculating 24h change:', error);
    return 0;
  }
};

/**
 * Fetches multiple trading pairs with retry logic
 */
export const fetchPopularPairs = async (pairs: string[], maxRetries = 3): Promise<TickerData[]> => {
  console.log('[OKX] Fetching popular pairs:', pairs);
  const results: TickerData[] = [];
  
  // Process pairs in parallel with a concurrency limit
  const BATCH_SIZE = 2; // Reduced batch size to avoid rate limiting
  
  for (let i = 0; i < pairs.length; i += BATCH_SIZE) {
    const batch = pairs.slice(i, i + BATCH_SIZE);
    console.log(`[OKX] Processing batch ${Math.floor(i/BATCH_SIZE) + 1}:`, batch);
    
    const batchPromises = batch.map(pair => 
      fetchTicker(pair).catch(error => {
        console.error(`[OKX] Failed to fetch ${pair}:`, error);
        return null;
      })
    );
    
    const batchResults = await Promise.all(batchPromises);
    const validResults = batchResults.filter(Boolean) as TickerData[];
    results.push(...validResults);
    
    // Add delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < pairs.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`[OKX] Successfully fetched ${results.length} of ${pairs.length} pairs`);
  return results;
};
