const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/login - Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi',
        code: 'VALIDATION_ERROR'
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid',
        code: 'INVALID_EMAIL_FORMAT'
      });
    }

    // Cari user berdasarkan email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      console.warn(`[AUTH] Login gagal: email "${email}" tidak ditemukan`);
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = users[0];

    // Verifikasi password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.warn(`[AUTH] Login gagal: password salah untuk email "${email}"`);
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log(`[AUTH] Login berhasil: user "${user.email}" (ID: ${user.id})`);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    console.error('[AUTH] Error saat login:', err);
    next(err);
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      console.warn(`[AUTH] User dengan ID ${req.user.id} tidak ditemukan`);
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (err) {
    console.error('[AUTH] Error saat mendapatkan profil user:', err);
    next(err);
  }
});

// POST /api/auth/logout - Logout user (client-side implementation)
router.post('/logout', verifyToken, async (req, res) => {
  try {
    console.log(`[AUTH] Logout berhasil: user "${req.user.email}" (ID: ${req.user.id})`);
    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (err) {
    console.error('[AUTH] Error saat logout:', err);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat logout',
      code: 'LOGOUT_ERROR'
    });
  }
});

// GET /api/auth/profile - Get current user profile
router.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (err) {
    console.error('[AUTH] Error saat mendapatkan profil:', err);
    next(err);
  }
});

// PUT /api/auth/profile - Update current user profile
router.put('/profile', verifyToken, async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan email wajib diisi',
        code: 'VALIDATION_ERROR'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid',
        code: 'INVALID_EMAIL_FORMAT'
      });
    }

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND id <> ?',
      [email, req.user.id]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah digunakan oleh akun lain',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, req.user.id]
    );

    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: users[0]
    });
  } catch (err) {
    console.error('[AUTH] Error saat memperbarui profil:', err);
    next(err);
  }
});

// PUT /api/auth/password - Change current user password
router.put('/password', verifyToken, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password lama, password baru, dan konfirmasi password wajib diisi',
        code: 'VALIDATION_ERROR'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password baru dan konfirmasi password tidak sama',
        code: 'PASSWORD_MISMATCH'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 8 karakter',
        code: 'WEAK_PASSWORD'
      });
    }

    const [users] = await pool.query('SELECT id, password FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        code: 'USER_NOT_FOUND'
      });
    }

    const valid = await bcrypt.compare(currentPassword, users[0].password);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'Password lama tidak sesuai',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({
      success: true,
      message: 'Password berhasil diperbarui'
    });
  } catch (err) {
    console.error('[AUTH] Error saat mengubah password:', err);
    next(err);
  }
});

// GET /api/auth/users - List users (admin only)
router.get('/users', verifyToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak', code: 'FORBIDDEN' });
    }

    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC, id DESC'
    );

    res.json({ success: true, data: users });
  } catch (err) {
    console.error('[AUTH] Error saat mengambil daftar user:', err);
    next(err);
  }
});

// POST /api/auth/users - Create user (admin only)
router.post('/users', verifyToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak', code: 'FORBIDDEN' });
    }

    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const confirmPassword = typeof req.body.confirmPassword === 'string' ? req.body.confirmPassword : '';

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Nama, email, password, dan konfirmasi password wajib diisi', code: 'VALIDATION_ERROR' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Format email tidak valid', code: 'INVALID_EMAIL_FORMAT' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password minimal 8 karakter', code: 'WEAK_PASSWORD' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password dan konfirmasi password tidak sama', code: 'PASSWORD_MISMATCH' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar', code: 'EMAIL_ALREADY_EXISTS' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'admin']
    );

    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, message: 'User berhasil ditambahkan', data: users[0] });
  } catch (err) {
    console.error('[AUTH] Error saat membuat user:', err);
    next(err);
  }
});

// PUT /api/auth/users/:id - Update user (admin only)
router.put('/users/:id', verifyToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak', code: 'FORBIDDEN' });
    }

    const targetId = Number(req.params.id);
    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({ success: false, message: 'ID user tidak valid', code: 'INVALID_ID' });
    }

    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const confirmPassword = typeof req.body.confirmPassword === 'string' ? req.body.confirmPassword : '';

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Nama dan email wajib diisi', code: 'VALIDATION_ERROR' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Format email tidak valid', code: 'INVALID_EMAIL_FORMAT' });
    }

    const [targetRows] = await pool.query('SELECT id FROM users WHERE id = ?', [targetId]);
    if (targetRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan', code: 'USER_NOT_FOUND' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? AND id <> ?', [email, targetId]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email sudah digunakan oleh akun lain', code: 'EMAIL_ALREADY_EXISTS' });
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password minimal 8 karakter', code: 'WEAK_PASSWORD' });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Password dan konfirmasi password tidak sama', code: 'PASSWORD_MISMATCH' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?', [name, email, hashedPassword, 'admin', targetId]);
    } else {
      await pool.query('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [name, email, 'admin', targetId]);
    }

    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [targetId]
    );

    res.json({ success: true, message: 'User berhasil diperbarui', data: users[0] });
  } catch (err) {
    console.error('[AUTH] Error saat memperbarui user:', err);
    next(err);
  }
});

// DELETE /api/auth/users/:id - Delete user (admin only)
router.delete('/users/:id', verifyToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak', code: 'FORBIDDEN' });
    }

    const targetId = Number(req.params.id);
    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({ success: false, message: 'ID user tidak valid', code: 'INVALID_ID' });
    }

    if (targetId === Number(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Tidak dapat menghapus akun yang sedang digunakan untuk login', code: 'CANNOT_DELETE_SELF' });
    }

    const [targetRows] = await pool.query('SELECT id, role FROM users WHERE id = ?', [targetId]);
    if (targetRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan', code: 'USER_NOT_FOUND' });
    }

    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM users WHERE role = ?', ['admin']);
    if (Number(countRows[0].total) <= 1) {
      return res.status(400).json({ success: false, message: 'Tidak dapat menghapus karena harus ada minimal satu akun Administrator', code: 'LAST_ADMIN' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [targetId]);

    res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('[AUTH] Error saat menghapus user:', err);
    next(err);
  }
});

// POST /api/auth/register - Register user (admin only)
router.post('/register', verifyToken, async (req, res, next) => {
  try {
    // Hanya admin yang bisa register user baru
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Hanya admin yang dapat membuat user baru',
        code: 'FORBIDDEN'
      });
    }

    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi',
        code: 'VALIDATION_ERROR'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter',
        code: 'WEAK_PASSWORD'
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid',
        code: 'INVALID_EMAIL_FORMAT'
      });
    }

    // Cek apakah email sudah terdaftar
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'admin']
    );

    console.log(`[AUTH] User baru terdaftar: "${email}" (ID: ${result.insertId})`);

    res.status(201).json({
      success: true,
      message: 'User berhasil dibuat',
      data: { id: result.insertId, name, email }
    });
  } catch (err) {
    console.error('[AUTH] Error saat register:', err);
    next(err);
  }
});

module.exports = router;
