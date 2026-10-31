import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import { requireAuth } from '../auth.js';
import { AuthenticatedRequest } from '../types.js';
import { extractTextFromFileBuffer, parseChat } from '../parser.js';

export const uploadsRouter = Router();

const maxUploadMb = parseInt(process.env.MAX_UPLOAD_MB || '20', 10);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxUploadMb * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const name = file.originalname.toLowerCase();
    if (name.endsWith('.txt') || name.endsWith('.zip') || file.mimetype === 'text/plain' || file.mimetype.includes('zip')) {
      cb(null, true);
    } else {
      cb(new Error('unsupported_file'));
    }
  },
});

uploadsRouter.post(
  '/preview',
  requireAuth,
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let rawText: string | null = null;
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'unsupported_file',
          message: 'Please upload a valid .txt or .zip WhatsApp chat export file.',
        });
      }

      try {
        rawText = extractTextFromFileBuffer(req.file.buffer, req.file.originalname);
      } catch (_err) {
        return res.status(400).json({
          error: 'unsupported_file',
          message: 'Could not read archive file. Please ensure it is a valid .zip or .txt file.',
        });
      }

      let parsed;
      try {
        parsed = parseChat(rawText);
      } catch (err: any) {
        if (err.message === 'too_short') {
          return res.status(400).json({
            error: 'too_short',
            message: 'Chat must contain at least 50 messages after cleaning.',
          });
        }
        return res.status(400).json({
          error: 'parse_failed',
          message: 'Unable to parse WhatsApp chat export. Please check the file format.',
        });
      }

      return res.status(200).json({
        participants: parsed.participants,
        messageCount: parsed.messages.length,
        dateRange: parsed.dateRange,
        isGroup: parsed.isGroup,
      });
    } catch (err: any) {
      if (err.message === 'unsupported_file') {
        return res.status(400).json({
          error: 'unsupported_file',
          message: 'Unsupported file type. Please upload a .txt or .zip file.',
        });
      }
      next(err);
    } finally {
      // Memory cleanup: Never retain raw chat text
      rawText = null;
      if (req.file) {
        (req.file as any).buffer = null;
      }
    }
  }
);

