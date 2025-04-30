export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      console.log('Request URL:', url.toString());
      
      // 添加 CORS 头
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      // 处理 OPTIONS 请求
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: corsHeaders,
          status: 204
        });
      }

      // 处理 WebSocket 连接
      if (request.headers.get('Upgrade') === 'websocket') {
        try {
          const { 0: client, 1: server } = new WebSocketPair();
          
          server.accept();
          server.addEventListener('message', (event) => {
            try {
              const message = event.data;
              server.send(JSON.stringify({ type: 'response', data: message }));
            } catch (error) {
              console.error('WebSocket message error:', error);
            }
          });
          
          return new Response(null, {
            status: 101,
            webSocket: client,
          });
        } catch (error) {
          console.error('WebSocket error:', error);
          return new Response('WebSocket error', { status: 500 });
        }
      }
      
      // 处理 API 请求
      if (url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ message: 'API endpoint' }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
          status: 200
        });
      }
      
      // 处理静态文件请求
      try {
        console.log('Fetching static file:', url.pathname);
        const response = await env.ASSETS.fetch(request);
        
        if (!response) {
          console.error('No response from ASSETS.fetch');
          return new Response('Not Found', { 
            status: 404,
            headers: corsHeaders
          });
        }

        const newResponse = new Response(response.body, response);
        newResponse.headers.set('Access-Control-Allow-Origin', '*');
        return newResponse;
      } catch (error) {
        console.error('Static file error:', error);
        return new Response('Not Found', { 
          status: 404,
          headers: corsHeaders
        });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
}; 