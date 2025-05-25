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

app.listen(PORT, () => {
  console.log(`\n🚀 Proxy running at http://localhost:${PORT}`);
  console.log('🔒 Authentication Status:', 
    process.env.OKX_API_KEY && process.env.OKX_SECRET && process.env.OKX_PASSPHRASE 
      ? 'Configured' 
      : '⚠️ INCOMPLETE - Check .env file'
  );
});
