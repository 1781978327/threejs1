export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    console.log('请求URL:', url.pathname);

    // 添加CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };

    // 处理OPTIONS请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    try {
      // 处理静态文件请求
      const response = await env.ASSETS.fetch(request);
      
      if (!response) {
        return new Response('Not Found', { status: 404 });
      }

      // 设置正确的Content-Type
      const contentType = getContentType(url.pathname);
      const headers = new Headers(response.headers);
      headers.set('Content-Type', contentType);
      headers.set('Cache-Control', 'public, max-age=31536000');
      
      // 添加CORS头
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        headers
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

// 根据文件扩展名获取Content-Type
function getContentType(pathname) {
  const ext = pathname.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html',
    'js': 'application/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'glb': 'model/gltf-binary',
    'gltf': 'model/gltf+json',
    'fbx': 'application/octet-stream',
    'obj': 'text/plain',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'audio/ogg',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav'
  };
  return types[ext] || 'application/octet-stream';
} 