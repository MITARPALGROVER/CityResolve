import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { configureCloudinary, uploadImageBuffer } from '../services/cloudinary.js';

export const uploadsRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
});

const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp']);

uploadsRouter.post('/images', requireAuth, upload.array('images', 4), async (req, res, next) => {
  try {
    const ok = configureCloudinary();
    if (!ok) {
      return res.status(500).json({ error: { message: 'Cloudinary is not configured' } });
    }

    const files = req.files || [];
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: { message: 'No images uploaded' } });
    }

    for (const file of files) {
      if (!allowedMime.has(file.mimetype)) {
        return res.status(400).json({ error: { message: `Unsupported image type: ${file.mimetype}` } });
      }
    }

    const results = [];
    for (const file of files) {
      const result = await uploadImageBuffer({
        buffer: file.buffer,
        folder: 'cityresolve/issues',
      });
      results.push({ url: result.secure_url, width: result.width, height: result.height });
    }

    res.json({ images: results, urls: results.map((r) => r.url) });
  } catch (err) {
    next(err);
  }
});
