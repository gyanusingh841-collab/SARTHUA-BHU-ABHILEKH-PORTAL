/**
 * Cloudflare Worker Custom Domain Proxy for Bihar Bhunaksha API
 * Proxies api.sarthua.in requests directly to AWS Mumbai Lambda (ap-south-1).
 */

const AWS_LAMBDA_ORIGIN = 'https://2n7i1ta403.execute-api.ap-south-1.amazonaws.com';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'sarthua-map-api', region: 'ap-south-1-mumbai' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Proxy all /api/* requests to AWS Mumbai Lambda
    const targetUrl = new URL(url.pathname + url.search, AWS_LAMBDA_ORIGIN);

    try {
      const response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: {
          'Accept': request.headers.get('Accept') || '*/*',
          'User-Agent': request.headers.get('User-Agent') || 'Sarthua-Proxy/1.0',
        },
      });

      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
      newHeaders.set('Cache-Control', 'public, max-age=3600');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
