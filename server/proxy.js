// server/proxy.js
import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = 3001;

const OKX_BASE = 'https://web3.okx.com/api/v5/dex';

// Initialize logging
console.log('🔧 Initializing proxy server...');
console.log('Environment Variables Check:');
console.log('- OKX_API_KEY:', process.env.OKX_API_KEY ? '***REDACTED***' : 'MISSING');
console.log('- OKX_SECRET:', process.env.OKX_SECRET ? '***REDACTED***' : 'MISSING');
console.log('- OKX_PASSPHRASE:', process.env.OKX_PASSPHRASE ? '***REDACTED***' : 'MISSING');

app.use(cors());
app.use(bodyParser.json());

// Enhanced signature function with logging
function createSignature(timestamp, method, requestPath, body, secret) {
  try {
    if (!secret) throw new Error('OKX_SECRET is undefined');
    
    console.log('🔐 Signature Generation:');
    console.log('- Timestamp:', timestamp);
    console.log('- Method:', method);
    console.log('- Request Path:', requestPath);
    console.log('- Body:', body.substring(0, 50) + (body.length > 50 ? '...' : ''));
    console.log('- Secret:', secret ? '***REDACTED***' : 'MISSING');

    const prehash = timestamp + method + requestPath + body;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(prehash)
      .digest('base64');

    console.log('✅ Generated Signature:', signature.substring(0, 10) + '...');
    return signature;
  } catch (err) {
    console.error('❌ Signature Error:', err.message);
    throw err;
  }
}

app.post('/dex/market/price-info', async (req, res) => {
  console.log('\n📨 Received POST /dex/market/price-info request');
  try {
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));

    const timestamp = new Date().toISOString();
    const method = 'POST';
    const requestPath = '/api/v5/dex/market/price-info';
    const body = JSON.stringify(req.body);

    console.log('🔧 Constructing OKX request:');
    console.log('- URL:', `${OKX_BASE}/market/price-info`);
    console.log('- Timestamp:', timestamp);
    
    const headers = {
      'Content-Type': 'application/json',
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, body, process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    console.log('🚀 Forwarding to OKX with headers:', {
      ...headers,
      'OK-ACCESS-KEY': headers['OK-ACCESS-KEY'] ? '***REDACTED***' : 'MISSING',
      'OK-ACCESS-SIGN': '***REDACTED***',
      'OK-ACCESS-PASSPHRASE': '***REDACTED***'
    });

    const response = await fetch(`${OKX_BASE}/market/price-info`, {
      method: 'POST',
      headers,
      body
    });

    console.log('📡 OKX Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    
    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ 
      error: 'Proxy Error',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Similar logging for GET endpoints
app.get('/dex/market/candles', async (req, res) => {
  console.log('\n📨 Received GET /dex/market/candles');
  try {
    console.log('🔍 Query Parameters:', req.query);
    
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/market/candles?${query}`;

    console.log('🔧 Constructing OKX request:');
    console.log('- Full URL:', `${OKX_BASE}/market/candles?${query}`);
    
    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/market/candles?${query}`, { headers });
    
    console.log('📡 OKX Response Status:', response.status);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/dex/market/trades', async (req, res) => {
  console.log('\n📨 Received GET /dex/market/trades');
  try {
    console.log('🔍 Query Parameters:', req.query);
    
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/market/trades?${query}`;

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/market/trades?${query}`, { headers });
    
    console.log('📡 OKX Response Status:', response.status);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get supported chains for aggregator

app.get('/dex/aggregator/supported/chain', async (req, res) => {
  console.log('\n📨 Received GET /dex/aggregator/supported/chain');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/aggregator/supported/chain${query ? '?' + query : ''}`;

    console.log('🔧 Constructing OKX request:');
    console.log('- Full URL:', `${OKX_BASE}/aggregator/supported/chain${query ? '?' + query : ''}`);

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/aggregator/supported/chain${query ? '?' + query : ''}`, { headers });

    console.log('📡 OKX Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');

    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

// Proxy endpoint for fetching all tokens on a chain
app.get('/dex/aggregator/all-tokens', async (req, res) => {
  console.log('\n📨 Received GET /dex/aggregator/all-tokens');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/aggregator/all-tokens${query ? '?' + query : ''}`;

    console.log('🔧 Constructing OKX request:');
    console.log('- Full URL:', `${OKX_BASE}/aggregator/all-tokens${query ? '?' + query : ''}`);

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/aggregator/all-tokens${query ? '?' + query : ''}`, { headers });

    console.log('📡 OKX Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');

    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});
// Proxy endpoint for fetching liquidity sources
app.get('/dex/aggregator/get-liquidity', async (req, res) => {
  console.log('\n📨 Received GET /dex/aggregator/get-liquidity');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/aggregator/get-liquidity${query ? '?' + query : ''}`;

    console.log('🔧 Constructing OKX request:');
    console.log('- Full URL:', `${OKX_BASE}/aggregator/get-liquidity${query ? '?' + query : ''}`);

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/aggregator/get-liquidity${query ? '?' + query : ''}`, { headers });

    console.log('📡 OKX Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');

    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

// Approve Transaction Proxy
app.get('/dex/aggregator/approve-transaction', async (req, res) => {
  console.log('\n📨 Received GET /dex/aggregator/approve-transaction');
  try {
    const { chainIndex, tokenContractAddress, approveAmount } = req.query;
    
    console.log('🔍 Query Parameters:', {
      chainIndex,
      tokenContractAddress: tokenContractAddress?.substring(0, 15) + '...',
      approveAmount
    });

    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/aggregator/approve-transaction?${query}`;

    console.log('🔧 Constructing OKX request:');
    console.log('- Full URL:', `${OKX_BASE}/aggregator/approve-transaction?${query}`);

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/aggregator/approve-transaction?${query}`, { headers });

    console.log('📡 OKX Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');

    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

// Proxy endpoint for Solana swap instructions
app.get('/dex/aggregator/swap-instruction', async (req, res) => {
  console.log('\n📨 Received GET /dex/aggregator/swap-instruction');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/aggregator/swap-instruction${query ? '?' + query : ''}`;

    console.log('🔧 Constructing OKX request:');
    console.log('- Full URL:', `${OKX_BASE}/aggregator/swap-instruction${query ? '?' + query : ''}`);

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/aggregator/swap-instruction${query ? '?' + query : ''}`, { headers });

    console.log('📡 OKX Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');

    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

//Get quote
// Quote Proxy Endpoint
app.get('/dex/aggregator/quote', async (req, res) => {
  console.log('\n📨 Received GET /dex/aggregator/quote');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/aggregator/quote${query ? '?' + query : ''}`;

    console.log('🔧 Constructing OKX request:');
    console.log('- Full URL:', `${OKX_BASE}/aggregator/quote${query ? '?' + query : ''}`);

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/aggregator/quote${query ? '?' + query : ''}`, { headers });

    console.log('📡 OKX Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');

    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

// Swap Proxy Endpoint
app.get('/dex/aggregator/swap', async (req, res) => {
  console.log('\n📨 Received GET /dex/aggregator/swap');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/aggregator/swap${query ? '?' + query : ''}`;

    console.log('🔧 Constructing OKX request:');
    console.log('- Full URL:', `${OKX_BASE}/aggregator/swap${query ? '?' + query : ''}`);
    console.log('- Query Params:', req.query);

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/aggregator/swap${query ? '?' + query : ''}`, { headers });

    console.log('📡 OKX Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');

    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

// History Proxy Endpoint
app.get('/dex/aggregator/history', async (req, res) => {
  console.log('\n📨 Received GET /dex/aggregator/history');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/dex/aggregator/history${query ? '?' + query : ''}`;

    console.log('🔧 Constructing OKX request:');
    console.log('- Full URL:', `${OKX_BASE}/aggregator/history${query ? '?' + query : ''}`);

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY || 'MISSING_API_KEY',
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || 'MISSING_PASSPHRASE',
      'OK-ACCESS-TIMESTAMP': timestamp
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`${OKX_BASE}/aggregator/history${query ? '?' + query : ''}`, { headers });

    console.log('📡 OKX Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');

    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

// Wallet API: Supported Blockchains
app.get('/wallet/chain/supported-chains', async (req, res) => {
  console.log('\n📨 Received GET /wallet/chain/supported-chains');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const requestPath = '/api/v5/wallet/chain/supported-chains';

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY,
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PROJECT': process.env.OKX_PROJECT_ID, // <--- Add this!
      'Content-Type': 'application/json'
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`https://web3.okx.com${requestPath}`, { headers });
    console.log('📡 OKX Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX Wallet API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Wallet API Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

// Total Value by Address (Wallet API)
app.get('/wallet/asset/total-value-by-address', async (req, res) => {
  console.log('\n📨 Received GET /wallet/asset/total-value-by-address');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/wallet/asset/total-value-by-address${query ? '?' + query : ''}`;

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY,
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PROJECT': process.env.OKX_PROJECT_ID,
      'Content-Type': 'application/json'
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`https://web3.okx.com${requestPath}`, { headers });
    console.log('📡 OKX Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX Wallet API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Wallet API Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

// Wallet API: All Token Balances by Address
app.get('/wallet/asset/all-token-balances-by-address', async (req, res) => {
  console.log('\n📨 Received GET /wallet/asset/all-token-balances-by-address');
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const query = new URLSearchParams(req.query).toString();
    const requestPath = `/api/v5/wallet/asset/all-token-balances-by-address${query ? '?' + query : ''}`;

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY,
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PROJECT': process.env.OKX_PROJECT_ID,
      'Content-Type': 'application/json'
    };

    const signature = createSignature(timestamp, method, requestPath, '', process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`https://web3.okx.com${requestPath}`, { headers });
    console.log('📡 OKX Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX Wallet API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Wallet API Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});

// Wallet API: Specific Token Balances by Address
app.post('/wallet/asset/token-balances-by-address', async (req, res) => {
  console.log('\n📨 Received POST /wallet/asset/token-balances-by-address');
  try {
    const timestamp = new Date().toISOString();
    const method = 'POST';
    const requestPath = '/api/v5/wallet/asset/token-balances-by-address';
    const body = JSON.stringify(req.body);

    const headers = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY,
      'OK-ACCESS-SIGN': '***CALCULATING***',
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PROJECT': process.env.OKX_PROJECT_ID,
      'Content-Type': 'application/json'
    };

    const signature = createSignature(timestamp, method, requestPath, body, process.env.OKX_SECRET);
    headers['OK-ACCESS-SIGN'] = signature;

    const response = await fetch(`https://web3.okx.com${requestPath}`, {
      method: 'POST',
      headers,
      body
    });

    console.log('📡 OKX Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OKX Wallet API Error:', errorText);
      return res.status(response.status).json({ error: `OKX Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('✅ OKX Wallet API Response Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    res.json(data);
  } catch (err) {
    console.error('🔥 Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`\n🚀 Proxy running at http://localhost:${PORT}`);
  console.log('🔒 Authentication Status:', 
    process.env.OKX_API_KEY && process.env.OKX_SECRET && process.env.OKX_PASSPHRASE 
      ? 'Configured' 
      : '⚠️ INCOMPLETE - Check .env file'
  );
});
