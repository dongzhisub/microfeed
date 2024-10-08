
export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/admin';

  // 渲染登录页面
  const loginPage = `
    <html>
      <body>
        <h1>Admin Login</h1>
        <form action="/auth/login" method="POST">
          <input type="password" name="password" required>
	  <input type="hidden" name="redirectTo" value="${redirectTo}">
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `;

  return new Response(loginPage, {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function onRequestPost({ request,env }) {
  const formData = await request.formData();
  const password = formData.get('password');
  const redirectTo = formData.get('redirectTo') || '/admin';
  //const crypto = require('crypto');

   // Access the secret key from environment variables
  const secretKey = `${env.SECRET_KEY}`; 

  async function hashSecret(secret) {
    const crypto = globalThis.crypto
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hash;
  }


  if (password === secretKey ) {
    const hashedSecretKey = hashSecret(secretKey);
    // 密码正确，设置认证 cookie 并重定向到管理页面
    return new Response('', {
      status: 302,
      headers: {
        'Location': redirectTo,
        'Set-Cookie': `authenticated=${hashedSecretKey}; HttpOnly; Secure; SameSite=Strict; Path=/admin`,
      },
    });
  } else {
    // 密码错误，返回错误消息
    return new Response('Invalid password', { status: 401 });
  }
}

