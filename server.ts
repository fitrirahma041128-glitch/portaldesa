import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-Memory store seeded from data for fast backend responses
const MOCK_CREDENTIALS: Record<string, { pass: string; role: string; name: string; email: string; jabatan: string }> = {
  admin: {
    pass: 'admin123',
    role: 'admin',
    name: 'Drs. H. Sukirman, M.Si.',
    email: 'admin@adimulya.desa.id',
    jabatan: 'Kepala Desa / Administrator Utama',
  },
  sekdes: {
    pass: 'sekdes123',
    role: 'perangkat',
    name: 'Ahmad Fauzi, S.Kom.',
    email: 'sekdes@adimulya.desa.id',
    jabatan: 'Sekretaris Desa Adimulya',
  },
  kaurkeu: {
    pass: 'kaurkeu123',
    role: 'perangkat',
    name: 'Sri Wahyuningsih, S.E.',
    email: 'keuangan@adimulya.desa.id',
    jabatan: 'Kaur Keuangan & APBDes',
  },
};

// -------------------------------------------------------------
// BACKEND REST API ROUTES
// -------------------------------------------------------------

// 1. Health & Server Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'SIMPANDADU - Sistem Informasi Desa Adimulya',
    version: '2.5.0',
    db: {
      type: 'MySQL Relational Schema (InnoDB)',
      schemaFile: 'src/db/schema.sql',
      database: process.env.DB_NAME || 'simpandadu_db',
    },
    timestamp: new Date().toISOString(),
  });
});

// 2. Authentication: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi.' });
  }

  const cleanUser = String(username).toLowerCase().trim();
  const user = MOCK_CREDENTIALS[cleanUser];

  if (!user || user.pass !== password) {
    return res.status(401).json({ error: 'Kredensial tidak valid. Periksa username dan password Anda.' });
  }

  const token = `simpandadu_token_${Date.now()}_${cleanUser}`;
  return res.json({
    success: true,
    message: `Autentikasi berhasil. Selamat datang ${user.name}!`,
    token,
    user: {
      username: cleanUser,
      name: user.name,
      email: user.email,
      role: user.role,
      jabatan: user.jabatan,
    },
  });
});

// 3. Authentication: Logout
app.post('/api/auth/logout', (_req: Request, res: Response) => {
  return res.json({ success: true, message: 'Sesi berhasil diakhiri.' });
});

// -------------------------------------------------------------
// VITE OR STATIC FRONTEND MOUNTING
// -------------------------------------------------------------

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SIMPANDADU] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SIMPANDADU] Failed to start server:', err);
});
