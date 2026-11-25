/* Servidor local de CAUGHT!: registro, inicio de sesión y recuperación. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const USERS_FILE = path.join(ROOT, 'data', 'users.json');
const sessions = new Map();
const PORT = Number(process.env.PORT || 3000);

function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
  catch { return []; }
}
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}
function hash(value, salt = crypto.randomBytes(16).toString('hex')) {
  return new Promise((resolve, reject) => crypto.scrypt(value, salt, 64, (error, key) => {
    if (error) reject(error); else resolve({ salt, hash: key.toString('hex') });
  }));
}
async function matches(value, saved) {
  if (!saved?.salt || !saved?.hash) return false;
  const candidate = await hash(value, saved.salt);
  return crypto.timingSafeEqual(Buffer.from(candidate.hash, 'hex'), Buffer.from(saved.hash, 'hex'));
}
function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}
function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => { body += chunk; if (body.length > 100000) request.destroy(); });
    request.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('JSON inválido')); } });
    request.on('error', reject);
  });
}
function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validPassword(password) { return typeof password === 'string' && password.length >= 6; }

async function api(request, response) {
  const data = await readBody(request);
  const email = String(data.email || '').trim().toLowerCase();
  const users = readUsers();

  if (request.url === '/api/auth/register') {
    const name = String(data.name || '').trim();
    if (name.length < 3 || !validEmail(email) || !validPassword(data.password)) {
      return json(response, 400, { error: 'Completá nombre, correo válido y una contraseña de al menos 6 caracteres.' });
    }
    if (users.some(user => user.email === email)) return json(response, 409, { error: 'Ya existe una cuenta con ese correo.' });
    const password = await hash(data.password);
    const user = { id: crypto.randomUUID(), name, email, password, createdAt: new Date().toISOString() };
    users.push(user); writeUsers(users);
    const token = crypto.randomBytes(32).toString('hex'); sessions.set(token, user.id);
    return json(response, 201, { message: 'Cuenta creada correctamente.', token, user: { name, email } });
  }

  if (request.url === '/api/auth/login') {
    const user = users.find(item => item.email === email);
    if (!user || !(await matches(data.password || '', user.password))) {
      return json(response, 401, { error: 'Correo o contraseña incorrectos.' });
    }
    const token = crypto.randomBytes(32).toString('hex'); sessions.set(token, user.id);
    return json(response, 200, { message: 'Sesión iniciada.', token, user: { name: user.name, email } });
  }

  if (request.url === '/api/auth/request-reset') {
    const user = users.find(item => item.email === email);
    /* Se responde igual aunque el correo no exista para no revelar cuentas. */
    if (user) {
      const code = String(crypto.randomInt(100000, 1000000));
      user.reset = { ...(await hash(code)), expiresAt: Date.now() + 15 * 60 * 1000 };
      writeUsers(users);
      console.log(`Código de recuperación para ${email}: ${code}`);
      return json(response, 200, { message: 'Revisá el código de recuperación.', developmentCode: process.env.NODE_ENV === 'production' ? undefined : code });
    }
    return json(response, 200, { message: 'Si existe una cuenta, se enviaron instrucciones.' });
  }

  if (request.url === '/api/auth/reset-password') {
    const user = users.find(item => item.email === email);
    if (!user?.reset || user.reset.expiresAt < Date.now() || !(await matches(String(data.code || ''), user.reset))) {
      return json(response, 400, { error: 'El código no es válido o venció.' });
    }
    if (!validPassword(data.password)) return json(response, 400, { error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    user.password = await hash(data.password); delete user.reset; writeUsers(users);
    return json(response, 200, { message: 'Contraseña actualizada. Ya podés iniciar sesión.' });
  }
  return json(response, 404, { error: 'Ruta no encontrada.' });
}

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };
const server = http.createServer(async (request, response) => {
  try {
    if (request.method === 'POST' && request.url.startsWith('/api/')) return await api(request, response);
    const pathname = request.url === '/' ? '/index/index.html' : decodeURIComponent(request.url.split('?')[0]);
    const file = path.resolve(ROOT, '.' + pathname);
    if (!file.startsWith(ROOT + path.sep)) return json(response, 403, { error: 'Acceso denegado.' });
    fs.readFile(file, (error, content) => {
      if (error) return response.end('Archivo no encontrado');
      response.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      response.end(content);
    });
  } catch (error) { json(response, 500, { error: 'Error interno del servidor.' }); }
});
server.listen(PORT, () => console.log(`CAUGHT! listo en http://localhost:${PORT}`));
