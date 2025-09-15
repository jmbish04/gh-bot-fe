interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }

    // Serve static assets with multi-page handling
    return handleStaticRequest(request, env);
  },
} satisfies ExportedHandler<Env>;

async function handleStaticRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  // Try to serve the requested file from ASSETS
  const response = await env.ASSETS.fetch(request);
  
  // If the file exists, return it
  if (response.status !== 404) {
    return response;
  }
  
  // For multi-page handling, try to serve index.html for non-API routes
  // that don't have a file extension (likely a page route)
  if (!url.pathname.includes('.')) {
    const indexRequest = new Request(new URL('/index.html', request.url), request);
    const indexResponse = await env.ASSETS.fetch(indexRequest);
    
    if (indexResponse.status !== 404) {
      return indexResponse;
    }
  }
  
  // If nothing found, return 404
  return new Response('Not Found', { status: 404 });
}

async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  
  // Proxy requests to the GitHub Bot API
  const apiUrl = `https://gh-bot.hacolby.workers.dev${path}${url.search}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'gh-bot-frontend/1.0.0',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    // Add CORS headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to connect to API' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
