export async function onRequestGet({ request }) {
  // 渲染登录页面
  const loginPage = `
    <html>
      <body>
        <h1>Admin Login</h1>
        <form action="/admin/login" method="POST">
          <input type="password" name="password" required>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `;

  return new Response(loginPage, {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function onRequestPost({ request }) {
  const formData = await request.formData();
  const password = formData.get('password');

  if (password === '2hot1mail9c') {
    // 密码正确，设置认证 cookie 并重定向到管理页面
    return new Response('', {
      status: 302,
      headers: {
        'Location': '/admin',
        'Set-Cookie': 'authenticated=true; HttpOnly; Secure; SameSite=Strict; Path=/admin',
      },
    });
  } else {
    // 密码错误，返回错误消息
    return new Response('Invalid password', { status: 401 });
  }
}

