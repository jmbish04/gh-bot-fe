interface Env {
  STATIC_ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }

    // Serve static assets
    return env.STATIC_ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

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
