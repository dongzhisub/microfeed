export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname === '/auth/login') {
    return handleLogin(request);
  }

  if (url.pathname === '/admin') {
    return handleAdmin(request);
  }

  return new Response('Not Found', { status: 404 });
}

async function handleLogin(request) {
  if (request.method === 'POST') {
    const formData = await request.formData();
    const password = formData.get('password');
    const correctPassword = '2hot1mail9c'; // Replace with your password

    if (password === correctPassword) {
      const headers = new Headers();
      headers.append('Set-Cookie', 'authenticated=true; HttpOnly; Secure; Path=/');
      return new Response('Login successful', { status: 200, headers });
    } else {
      return new Response('Incorrect password', { status: 401 });
    }
  }

  return new Response(`
    <html>
      <body>
        <form method="POST">
          <label>Password:</label>
          <input type="password" name="password" required>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `, { status: 200, headers: { 'Content-Type': 'text/html' } });
}

async function handleAdmin(request) {
  const isAuthenticated = request.headers.get('Cookie') === 'authenticated=true';
  if (!isAuthenticated) {
    return Response.redirect('/auth/login', 302);
  }

  return new Response('Welcome to the admin page', { status: 200 });
}

